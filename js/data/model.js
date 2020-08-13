import * as collection from "./collection";
import { NotFoundError, NotImplementedError, ValidationError } from "../base";
import { verify } from "../util";

const MEMORY_STORAGE = {};

const TYPE_DEFAULTS = {
    bytes: null,
    unicode: null,
    int: null,
    float: null,
    bool: false,
    list: () => [],
    dict: () => ({}),
    object: () => ({})
};

export class Model {
    constructor(options = {}) {
        const fill = options.fill === undefined ? true : options.fill;
        if (fill) this.constructor.fill(this);
    }

    static niw() {
        return new this();
    }

    /**
     * Fills the current model with the proper values so that
     * no values are unset as this would violate the model definition
     * integrity. This is required when retrieving an object(s) from
     * the data source (as some of them may be incomplete).
     *
     * @param {Object} model The model that is going to have its unset
     * attributes filled with "default" data, in case none is provided
     * all of the attributes will be filled with "default" data.
     * @param {Boolean} safe If the safe mode should be used for the fill
     * operation meaning that under some conditions no unit fill
     * operation is going to be applied (eg: retrieval operations).
     */
    static async fill(model = {}, safe = false) {
        for (const [name, field] of Object.entries(this.schema)) {
            if (model[name] !== undefined) continue;
            if (["_id"].includes(model[name])) continue;
            const _private = field.private === undefined ? false : field.private;
            const increment = field.increment === undefined ? false : field.increment;
            if (_private && safe) continue;
            if (increment) continue;
            if (field.initial !== undefined) {
                const initial = field.initial;
                model[name] = initial;
            } else {
                const type = field.type || null;
                let _default = typeD(type, null);
                _default = type._default === undefined ? _default : type._default();
                model[name] = _default;
            }
        }
    }

    /**
     * The name of the data source adapter that is going
     * to be used to handle this model instance.
     *
     * @type {String}
     */
    static get adapter() {
        return process.env.ADAPTER || "mongo";
    }

    async validate() {
        const errors = [...this._validate()];
        if (errors.length) {
            throw new ValidationError(
                `Invalid model: ${errors.map(err => String(err)).join(", ")}`
            );
        }
    }

    async apply(model) {
        await this.wrap(model);
        return this;
    }

    async wrap(model) {
        await this._wrap(model);
        return this;
    }

    get model() {
        return this;
    }

    get jsonV() {
        return this.model;
    }

    get string() {
        return JSON.stringify(this.model);
    }

    /**
     * Wraps the provided model object around the current instance, making
     * sure that all of the elements are compliant with the schema.
     *
     * It should be possible to override the `_wrap` operation to implement
     * a custom "way" of setting data into a model.
     *
     * @param {Object} model The model structure that is going to be used
     * to wrap the current model object, meaning that all of its elements
     * are going to be stored in the current object.
     */
    async _wrap(model) {
        for (const key of Object.keys(this.constructor.schema)) {
            if (model[key] === undefined) continue;
            this[key] = model[key];
        }
        if (model._id !== undefined) this._id = model._id;
    }

    * _validate() {
        for (const [name, value] of Object.entries(this.constructor.schema)) {
            const validation = value.validation || false;
            if (!validation) continue;
            for (const callable of validation) {
                try {
                    callable(this[name]);
                } catch (err) {
                    yield err;
                }
            }
        }
    }
}

export class ModelStore extends Model {
    static async find(options = {}) {
        const found = await this.collection.find(options);
        const models = await Promise.all(found.map(v => new this().wrap(v)));
        return models;
    }

    static async get(id) {
        const options = {};
        options[this.idName] = id;
        const model = await this.collection.findOne(options);

        if (!model) {
            throw new NotFoundError();
        }

        const instance = new this();
        return instance.wrap(model);
    }

    static get schema() {
        throw new NotImplementedError();
    }

    /**
     * Safer version of the schema structure that filters
     * some of the field attributes making it suitable to
     * be used by some of the collection adapters.
     */
    static get schemaSafe() {
        const schema = {};
        for (const [key, value] of Object.entries(this.schema)) {
            schema[key] = {
                type: value.type || String,
                index: value.index || false
            };
        }
        return schema;
    }

    static get collection() {
        if (this._collectionI) return this._collectionI;
        this._collectionI = this._collection(this.dataOptions);
        return this._collectionI;
    }

    static get idName() {
        return "id";
    }

    static get dataOptions() {
        return {
            name: this.name,
            schema: this.schemaSafe
        };
    }

    static get increments() {
        if (this._increments !== undefined) return this._increments;
        const increments = [];

        for (const [name, value] of Object.entries(this.schema)) {
            const isIncrement = value.increment || false;
            if (!isIncrement) continue;
            increments.push(name);
        }

        this._increments = increments;
        return increments;
    }

    static _collection(options) {
        const adapter = this.adapter[0].toUpperCase() + this.adapter.slice(1);
        return new collection[adapter + "Collection"](options);
    }

    static async _increment(name) {
        const _name = this.name + ":" + name;
        const store = this._collection({
            name: "counters",
            schema: {
                id: { type: String, index: true },
                seq: { type: Number }
            }
        });
        let result = await store.findOneAndUpdate(
            {
                id: _name
            },
            {
                $inc: {
                    seq: 1
                }
            },
            {
                new: true,
                upsert: true
            }
        );
        result = result || (await store.findOne({ id: _name }));
        return result.seq;
    }

    static async _ensureMin(name, value) {
        const _name = this.name + ":" + name;
        const store = this._collection({
            name: "counters",
            schema: {
                id: { type: String },
                seq: { type: Number }
            }
        });
        let result = await store.findOneAndUpdate(
            {
                id: _name
            },
            {
                $max: {
                    seq: value
                }
            },
            {
                new: true,
                upsert: true
            }
        );
        result = result || (await store.findOne({ id: _name }));
        return result.seq;
    }

    async save(validate = true) {
        let model;

        // iterates over each of the fields that are meant to have its value
        // increment and performs the appropriate operation taking into account
        // if the value is already populated or not
        for (const name of this.constructor.increments) {
            const exists = this.model[name] !== undefined;
            if (exists) {
                this.model[name] = await this.constructor._ensureMin(name, this.model[name]);
            } else {
                this.model[name] = await this.constructor._increment(name);
            }
        }

        // in case the validate flag is set runs the model validation
        // defined for the current model
        if (validate) await this.validate();

        // runs the lower layer integrity verifications that should raise
        // exception in case there's a failure
        await this.verify();

        // verifies if the current model is a new one or if instead
        // represents an update to a previously stored model and create
        // or update data accordingly
        const isNew = this._id === undefined;
        if (isNew) {
            model = await this.constructor.collection.create(this.model);
        } else {
            const conditions = {};
            conditions[this.constructor.idName] = this.identifier;
            model = await this.constructor.collection.findOneAndUpdate(conditions, this.model);
        }

        // wraps the model object using the current instance
        // effectively making the data available for consumers
        this.wrap(model);

        return this;
    }

    async delete() {
        const conditions = {};
        conditions[this.constructor.idName] = this.identifier;
        await this.constructor.collection.findOneAndDelete(conditions);
        return this;
    }

    /**
     * Runs a series of assertions on the current model
     * definition raising assertion errors in case there
     * are issues with the internal structure of it.
     */
    async verify() {
        verify(
            this.identifier !== undefined && this.identifier !== null,
            "The identifier must be defined before saving"
        );
        for (const [name, field] of Object.entries(this.constructor.schema)) {
            verify(
                !field.required || ![undefined, null].includes(this[name]),
                `No value provided for mandatory field '${name}'`
            );
        }
    }

    get identifier() {
        return this[this.constructor.idName];
    }
}

export class ModelMemory extends ModelStore {
    static get adapter() {
        return "memory";
    }

    static get dataOptions() {
        return Object.assign(super.dataOptions, { storage: this.storage });
    }

    static get storage() {
        return MEMORY_STORAGE[this.name];
    }
}

/**
 * Retrieves the default (initial) value for the a certain
 * provided data type falling back to the provided default
 * value in case it's not possible to retrieve a new valid
 *  default for value for the type.
 *
 * The process of retrieval of the default value to a certain
 * type may include the calling of a lambda function to obtain
 * a new instance of the default value, this avoid the usage
 * of global shared structures for the default values, that
 * could cause extremely confusing situations.
 *
 * @param {Type} type The data type object for which to retrieve its
 * default value.
 * @param {Object} _default The default value to be returned in case it's
 * not possible to retrieve a better one.
 * @returns {Object} The "final" default value for the data type according
 * to the best possible strategy.
 */
export const typeD = function(type, _default = null) {
    if (TYPE_DEFAULTS[type] === undefined) return _default;
    _default = TYPE_DEFAULTS[type];
    if (typeof _default !== "function") return _default;
    return _default();
};

export default Model;

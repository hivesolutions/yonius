import * as collection from "./collection";
import { NotFoundError, NotImplementedError } from "../base";
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
        if (fill) this.fill(this);
    }

    static niw() {
        return new this();
    }

    static get adapter() {
        return process.env.ADAPTER || "mongo";
    }

    async validate() {
        const errors = [...this._validate()];
        if (errors.length) {
            throw new Error(`Invalid model: ${errors.map(err => String(err)).join(", ")}`);
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

    * _validate() {}
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

    static get collection() {
        if (this._collection) return this._collection;
        const adapter = this.adapter[0].toUpperCase() + this.adapter.slice(1);
        this._collection = new collection[adapter + "Collection"](this.dataOptions);
        return this._collection;
    }

    static get idName() {
        return "id";
    }

    static get dataOptions() {
        return {
            name: this.name,
            schema: this.schema
        };
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
            if (model.name !== undefined) continue;
            if (["_id"].includes(model.name)) continue;
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

    async save(validate = true) {
        let model;
        if (validate) await this.validate();
        await this.verify();
        const isNew = this._id === undefined;
        const conditions = {};
        conditions[this.constructor.idName] = this.identifier;
        if (isNew) model = await this.constructor.collection.create(this.model);
        else model = await this.constructor.collection.findOneAndUpdate(conditions, this.model);
        this.wrap(model);
        return this;
    }

    async delete() {
        const conditions = {};
        conditions[this.constructor.idName] = this.identifier;
        await this.constructor.collection.findOneAndDelete(conditions);
        return this;
    }

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

import * as collection from "./collection";
import { NotFoundError, NotImplementedError, ValidationError } from "../base";
import { escapeStringRegexp, verify, _isDevel } from "../util";

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

/**
 * The map that associates the various operators with the boolean
 * values that define if an insensitive base search should be used
 * instead of the "typical" sensitive search.
 */
export const INSENSITIVE = {
    likei: true,
    llikei: true,
    rlikei: true
};

/**
 * The map containing the mapping association between the
 * normalized version of the operators and the infra-structure
 * specific value for each of this operations, note that some
 * of the values don't have a valid mapping for this operations
 * the operator must be ignored and not used explicitly.
 */
export const OPERATORS = {
    eq: null,
    equals: null,
    ne: "$ne",
    not_equals: "$ne",
    in: "$in",
    nin: "$nin",
    not_in: "$nin",
    like: "$regex",
    likei: "$regex",
    llike: "$regex",
    llikei: "$regex",
    rlike: "$regex",
    rlikei: "$regex",
    gt: "$gt",
    greater: "$gt",
    gte: "$gte",
    greater_equal: "$gte",
    lt: "$lt",
    lesser: "$lt",
    lte: "$lte",
    lesser_equal: "$lte",
    null: null,
    is_null: null,
    not_null: "$ne",
    is_not_null: "$ne",
    contains: "$all"
};

/**
 * Map that associates each of the normalized operations with
 * an inline function that together with the data type maps the
 * the base string based value into the target normalized value.
 */
export const VALUE_METHODS = {
    in: (v, t) => v.split(";").map(t),
    not_in: (v, t) => v.split(";").map(t),
    like: (v, t) => "^.*" + escapeStringRegexp(v) + ".*$",
    likei: (v, t) => "^.*" + escapeStringRegexp(v) + ".*$",
    llike: (v, t) => "^.*" + escapeStringRegexp(v) + "$",
    llikei: (v, t) => "^.*" + escapeStringRegexp(v) + "$",
    rlike: (v, t) => "^" + escapeStringRegexp(v) + ".*$",
    rlikei: (v, t) => "^" + escapeStringRegexp(v) + ".*$",
    null: (v, t) => null,
    is_null: (v, t) => null,
    not_null: (v, t) => null,
    is_not_null: (v, t) => null,
    contains: (v, t) => v.split(";")
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
    static _getAttrs(params, attrs) {
        const _attrs = [];

        attrs.forEach(([attr, value]) => {
            if (params[attr] === undefined) {
                _attrs.push(value);
                return;
            }

            const _value = params[attr];
            delete params[attr];
            _attrs.push(_value);
        });

        return _attrs;
    }

    static async get(params = {}) {
        /* eslint-disable no-unused-vars */
        const [
            fields,
            eager,
            eagerL,
            map,
            rules,
            meta,
            build,
            fill,
            resolveA,
            skip,
            limit,
            sort,
            raiseE
        ] = this._getAttrs(params, [
            ["fields", null],
            ["eager", null],
            ["eagerL", null],
            ["map", false],
            ["rules", true],
            ["meta", false],
            ["build", true],
            ["fill", true],
            ["resolveA", null],
            ["skip", 0],
            ["limit", 0],
            ["sort", null],
            ["raiseE", true]
        ]);
        /* eslint-enable no-unused-vars */

        const sortObject = {};
        if (sort) {
            sort.forEach(([key, value]) => (sortObject[key] = value));
        }

        const found = await this.collection.findOne(params, this.fields, {
            skip: skip,
            limit: limit,
            sort: sortObject
        });

        if (!found && raiseE) {
            let message;
            if (_isDevel()) {
                message = `${this.name} not found for ${JSON.stringify(params)}`;
            } else {
                message = `${this.name} not found`;
            }
            throw new NotFoundError(message);
        }

        const model = found ? await new this().wrap(found) : found;
        return model;
    }

    static async find(params = {}) {
        /* eslint-disable no-unused-vars */
        const [
            fields,
            eager,
            eagerL,
            map,
            rules,
            meta,
            build,
            fill,
            resolveA,
            skip,
            limit,
            sort,
            raiseE
        ] = this._getAttrs(params, [
            ["fields", null],
            ["eager", null],
            ["eagerL", null],
            ["map", false],
            ["rules", true],
            ["meta", false],
            ["build", true],
            ["fill", true],
            ["resolveA", null],
            ["skip", 0],
            ["limit", 0],
            ["sort", null],
            ["raiseE", false]
        ]);
        /* eslint-enable no-unused-vars */

        this._findS(params);
        this._findD(params);

        const sortObject = {};
        if (sort) {
            sort.forEach(([key, value]) => (sortObject[key] = value));
        }

        const found = await this.collection.find(params, this.fields, {
            skip: skip,
            limit: limit,
            sort: sortObject
        });

        if (found.length === 0 && raiseE) {
            let message;
            if (_isDevel()) {
                message = `${this.name} not found for ${JSON.stringify(params)}`;
            } else {
                message = `${this.name} not found`;
            }
            throw new NotFoundError(message);
        }

        const models = await Promise.all(found.map(v => new this().wrap(v)));
        return models;
    }

    static _findD(params) {
        // retrieves the find definition into a local variable, then
        // removes the find definition from the named arguments map
        // so that it's not going to be erroneously used by the
        // underlying find infra-structure
        const findD = params.find_d;
        delete params.find_d;

        // in case the find definition is currently not defined in the
        // named arguments map returns immediately as nothing is
        // meant to be done on this method
        if (!findD) return;

        // tries to retrieve the value of the operator that is going
        // to be used to "join" the multiple find parts (find values)
        const findO = params.find_o;
        delete params.find_o;

        // verifies that the data type for the find definition is a
        // valid sequence and in case its not converts it into one
        // so that it may be used in sequence valid logic
        const _findD = Array.isArray(findD) ? findD : [findD];

        // iterates over all the filters defined in the filter definition
        // so that they may be used to update the provided arguments with
        // the filter defined in each of their lines
        for (const filter of _findD) {
            // in case the filter is not valid (unset or invalid) it's going
            // to be ignored as no valid information is present
            if (!filter) continue;

            // splits the filter string into its three main components
            // the name, operator and value, that are going to be processed
            // as defined by the specification to create the filter
            const result = filter.split(":", 3);
            if (result.length === 2) result.push(null);

            // unpacks the result into it's thee components name, operator
            // and value to be used in the parsing of the filter
            const [name, operator, value] = result;

            // retrieves the definition for the filter attribute and uses
            // it to retrieve it's target data type that is going to be
            // used for the proper conversion, note that in case the base
            // type resolution method exists it's used (recursive resolution)
            const nameDefinition = this.definitionN(name);
            const nameT = nameDefinition._btype || nameDefinition.type || String;

            // determines if the current filter operation should be performed
            // using a case insensitive based approach to the search, by default
            // all of the operations are considered to be case sensitive
            const insensitive = INSENSITIVE[operator] || false;

            // retrieves the method that is going to be used for value mapping
            // or conversion based on the current operator and then converts
            // the operator into the domain specific operator
            const valueMethod = VALUE_METHODS[operator];
            const _operator = OPERATORS[operator] === undefined ? operator : OPERATORS[operator];

            // in case there's a custom value mapped retrieved uses it to convert
            // the string based value into the target specific value for the query
            // otherwise uses the data type for the search field for value conversion
            const _value = valueMethod ? valueMethod(value, nameT) : nameT(value);

            // constructs the custom find value using a key and value map value
            // in case the operator is defined otherwise (operator not defined)
            // the value is used directly, then merges this find value into the
            // current set of filters for the provided (keyword) arguments
            let findV;
            if (_operator) {
                const obj = {};
                obj[_operator] = _value;
                findV = obj;
            } else {
                findV = _value;
            }

            if (insensitive) findV.$options = "-i";
            this._filterMerge(name, findV, params, findO);
        }
    }

    static _findS(params) {
        // tries to retrieve the find name value from the provided
        // named arguments defaulting to an unset value otherwise
        const findN = params.find_n;
        delete params.find_n;

        // retrieves the kind of insensitive strategy that is going
        // to be used for the resolution of regular expressions,
        // this should affect all the filters and so it should be
        // used with some amount of care
        const findI = params.find_i || false;
        delete params.find_i;

        // retrieves the kind of default operation to be performed
        // this may be either: right, left or both and the default
        // value is both so that the token is matched in case it
        // appears anywhere in the search string
        const findT = params.find_t || "both";
        delete params.find_t;

        // retrieves the find string into a local variable, then
        // removes the find string from the named arguments map
        // so that it's not going to be erroneously used by the
        // underlying find infra-structure
        const findS = params.find_s;
        delete params.find_s;

        // in case the find string is currently not defined in the
        // named arguments map returns immediately as nothing is
        // meant to be done on this method
        if (!findS) return;

        // retrieves the "name" of the attribute that is considered
        // to be the default (representation) for the model in case
        // there's none returns immediately, as it's not possible
        // to proceed with the filter creation
        const defaultName = findN || this.default; // TODO DEFAULT WORKS?
        if (!defaultName) return;

        // constructs the proper right and left parts of the regex
        // that is going to be constructed for the matching of the
        // value, this is achieved by checking the find type
        const right = findT === "right" ? "^" : "";
        const left = findT === "left" ? "$" : "";

        // retrieves the definition for the default attribute and uses
        // it to retrieve it's target data type, defaulting to the
        // string type in case none is defined in the schema
        const defaultT = this.definitionN(defaultName).type || String;

        let findV;

        try {
            // in case the target date type for the default field is
            // string the both sides wildcard regex is used for the
            // search
            if (defaultT === String) {
                findV = {
                    $regex: right + escapeStringRegexp(findS) + left,
                    $options: findI ? "-i" : ""
                };
            } else {
                findV = null;
            }
        } catch (err) {
            // in case there's an error in the conversion for
            // the target type value sets the search value as
            // invalid (not going to be used in filter)
            findV = null;
        }

        if (findV) this._filterMerge(defaultName, findV, params);
    }

    static get fields() {
        return Object.keys(this.schema);
    }

    static get default() {
        const defaultEntry = Object.entries(this.schema).find(
            ([name, definition]) => definition.default
        );
        return defaultEntry ? defaultEntry[0] : null;
    }

    static definitionN(name) {
        return this.schema[name] || {};
    }

    static _filterMerge(name, filter, params, operator = null) {
        // retrieves a possible previous filter defined for the
        // provided name in case it does exist must concatenate
        // that previous value in a join statement according to
        // the currently defined operator
        const filterP = params[name];
        if (filterP || operator) {
            // defaults the operator for the join of the names to the
            // value and then ensures that the value of the operator
            // is within a valid range of values
            const _operator = operator || "$and";
            verify(["$and", "$or"].includes(_operator));

            // retrieves the and references for the current arguments
            // and appends the two filter values (current and previous)
            // then deletes the current name reference in the arguments
            // and updates the name value to the and value
            const filterA = params[_operator] || [];

            // builds the filter object assigned to the name of the
            // variable and adds to the list of values
            const _filter = {};
            _filter[name] = filter;
            filterA.push(_filter);

            // in case there's a previous filter also adds it to the
            // list of filter values
            if (filterP) {
                const _filterP = {};
                _filterP[name] = filterP;
                filterA.push(_filterP);
            }

            // updates the filter reference and updates the operator
            // name (as expected)
            filter = filterA;
            delete params[name];
            name = _operator;
        }

        // sets the currently defined filter structures in the keyword
        // based arguments map for the currently defined name
        params[name] = filter;
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

    async save({
        validate = true,
        preSave = true,
        preCreate = true,
        preUpdate = true,
        postSave = true,
        postCreate = true,
        postUpdate = true,
        beforeCallbacks = [],
        afterCallbacks = []
    } = {}) {
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

        // calls the complete set of event handlers for the current
        // save operation, this should trigger changes in the model
        if (preSave) await this.preSave();
        if (preCreate) await this.preCreate();
        if (preUpdate) await this.preUpdate();

        // calls the complete set of callbacks that should be called
        // before the concrete data store save operation
        for (const callback of beforeCallbacks) {
            await callback(this, this.model);
        }

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

        // calls the complete set of callbacks that should be called
        // after the concrete data store save operation
        for (const callback of afterCallbacks) {
            await callback(this, this.model);
        }

        // calls the post save event handlers in order to be able to
        // execute appropriate post operations
        if (postSave) await this.postSave();
        if (postCreate) await this.postCreate();
        if (postUpdate) await this.postUpdate();

        return this;
    }

    async delete({
        preDelete = true,
        postDelete = true,
        beforeCallbacks = [],
        afterCallbacks = []
    } = {}) {
        // calls the complete set of event handlers for the current
        // delete operation, this should trigger changes in the model
        if (preDelete) await this.preDelete();

        // calls the complete set of callbacks that should be called
        // before the concrete data store delete operation
        for (const callback of beforeCallbacks) {
            await callback(this, this.model);
        }

        const conditions = {};
        conditions[this.constructor.idName] = this.identifier;
        await this.constructor.collection.findOneAndDelete(conditions);

        // calls the complete set of callbacks that should be called
        // after the concrete data store delete operation
        for (const callback of afterCallbacks) {
            await callback(this, this.model);
        }

        // calls the complete set of event handlers for the current
        // delete operation, this should trigger changes in the model
        if (postDelete) await this.postDelete();

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

    async preSave() {}

    async preCreate() {}

    async preUpdate() {}

    async preDelete() {}

    async postSave() {}

    async postCreate() {}

    async postUpdate() {}

    async postDelete() {}

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

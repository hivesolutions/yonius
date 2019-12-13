import { verify } from "./assert";
import { escapeStringRegexp } from "./regex";

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

export const find = function(params, collection, modelClass) {
    _findS(params, modelClass);
    _findD(params);

    const { skip = 0, limit = 0, sort = null } = params;

    collection.find({
        ...params,
        skip: skip,
        limit: limit,
        sort: sort
    });
};

export const getDefault = function(modelClass) {
    return (Object.entries(modelClass.schema)
        .findOne(([name, definition]) => definition.default) || {}).name || null;
};

export const getDefinitionN = function(name, modelClass) {
    return modelClass.schema[name];
};

const _findD = function(params) {
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

        const [name, operator, value] = result;

        // retrieves the definition for the filter attribute and uses
        // it to retrieve it's target data type that is going to be
        // used for the proper conversion, note that in case the base
        // type resolution method exists it's used (recursive resolution)
        const nameDefinition = getDefinitionN(name);
        const nameT = nameDefinition._btype || nameDefinition.type || String;
        // TODO: if name in ("_id",): name_t = cls._adapter().object_id

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
        let _value = valueMethod ? valueMethod(value, nameT) : nameT(value);

        // constructs the custom find value using a key and value map value
        // in case the operator is defined otherwise (operator not defined)
        // the value is used directly, then merges this find value into the
        // current set of filters for the provided (keyword) arguments
        let findV;
        if (_operator) {
            const obj = {};
            obj[_operator] = value;
            findV = obj;
        } else {
            findV = _value;
        }

        if (insensitive) findV.$options = "-i";
        _filterMerge(name, findV, params, findO);
    }
};

const _findS = function(params, modelClass) {
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
    const defaultName = findN || getDefault(modelClass);
    if (!defaultName) return;

    // constructs the proper right and left parts of the regex
    // that is going to be constructed for the matching of the
    // value, this is achieved by checking the find type
    const right = findT === "right" ? "^" : "";
    const left = findT === "left" ? "$" : "";

    // retrieves the definition for the default attribute and uses
    // it to retrieve it's target data type, defaulting to the
    // string type in case none is defined in the schema
    const defaultT = getDefinitionN(defaultName, modelClass).type || String;

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

    if (findV) _filterMerge(defaultName, findV, params);
};

const _filterMerge = function(name, filter, params, operator = null) {
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
        const _filter = filterP ? filterA.concat([{ name: filter }, { name: filterP }]) : filterA.concat([{ name: filter }]);
        delete params[name];
        params[operator] = _filter;
    }

    params[name] = filter;
};

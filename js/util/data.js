/**
 * The map containing the various attribute alias between the normalized
 * manned and the Yonius manner.
 */
export const ALIAS = {
    context: "find_d",
    filters: "find_d",
    "filters[]": "find_d",
    filter_def: "find_d",
    filter_string: "find_s",
    filter_name: "find_n",
    filter_operator: "find_o",
    insensitive: "find_i",
    order: "sort",
    offset: "skip",
    start_record: "skip",
    number_records: "limit"
};

/**
 * The map associating the various find fields with their respective
 * types, note that in case a special conversion operation is required
 * the associated value may represent a conversion function instead.
 */
export const FIND_TYPES = {
    skip: v => parseInt(v),
    limit: v => Math.max(0, parseInt(v)),
    find_s: v => v,
    find_d: v => (Array.isArray(v) ? v : [v]),
    find_i: v => Boolean(v),
    find_t: v => v,
    find_n: v => v,
    find_o: v => v,
    sort: v => _toSort(v),
    meta: v => Boolean(v),
    fields: v => v
};

/**
 * The map that defines the various default values for a series of
 * find related attributes.
 */
export const FIND_DEFAULTS = { limit: 10 };

/**
 * The map associating the normalized (text) way of representing sorting
 * with the current infra-structure number way of representing the same
 * information.
 */
export const SORT_MAP = {
    1: 1,
    "-1": -1,
    ascending: 1,
    descending: -1
};

export const getObject = function(params = {}, options = {}) {
    const { alias = false, page = false, find = false, norm = true } = options;
    let result = params;

    // in case the alias flag is set tries to resolve the attribute alias and
    // in case the find types are set converts the find based attributes using
    // the currently defined mapping map
    if (alias) result = _resolveAlias(result);
    if (page) result = _pageTypes(result);
    if (find) {
        result = _findTypes(result);
        result = _findDefaults(result, options);
    }

    // in case the normalization flag is set runs the normalization of the
    // provided object so that sequences are properly handled as defined in
    // the specification (this allows multiple references)
    if (norm) result = _normParams(result);

    // returns the constructed object to the caller method this object
    // should be a structured representation of the data in the request
    return result;
};

const _resolveAlias = function(params) {
    const result = {};
    Object.entries(params).forEach(([key, value]) => {
        result[ALIAS[key] || key] = value;
    });
    return result;
};

const _pageTypes = function(params, defaultSize = 50) {
    const result = Object.assign({}, params);

    const page = parseInt(params.page || 1);
    const size = parseInt(params.size || defaultSize);
    const offset = page - 1;
    result.skip = offset * size;
    result.limit = size;

    const sorter = params.sorter;
    const direction = params.direction || "descending";
    if (sorter) result.sort = `${sorter}:${direction}`;

    return result;
};

const _toSort = function(value) {
    const values = value.split(":", 2);
    if (values.length === 1) values.push("descending");
    const [name, direction] = values;
    if (name === "default") return null;
    values[1] = SORT_MAP[direction] || 1;
    return [values];
};

const _findTypes = function(params) {
    const result = {};
    Object.entries(params).forEach(([key, value]) => {
        const converter = FIND_TYPES[key];
        const converted = converter ? converter(value) : value;
        result[key] = converted;
    });
    return result;
};

const _findDefaults = function(params, options = {}) {
    const result = Object.assign({}, params);
    Object.entries(options)
        .filter(([key]) => FIND_TYPES[key])
        .forEach(([key, value]) => {
            result[key] = params[key] || value;
        });
    Object.entries(FIND_DEFAULTS).forEach(([key, value]) => {
        result[key] = params[key] || value;
    });
    return result;
};

const _normParams = function(params) {
    const result = Object.assign({}, params);

    // iterates over all the key value association in the object,
    // trying to find the ones that refer sequences so that they
    // may be normalized
    for (const [key, value] of Object.entries(params)) {
        // verifies if the current name references a sequence and
        // if that's not the case continues the loop trying to find
        // any other sequence based value
        if (!key.endsWith("[]")) {
            result[key] = value;
            continue;
        }

        // removes the extra sequence indication value
        const name = key.substring(0, key.length - 2);

        // in case the current value is not valid (empty) the object
        // is set with an empty list for the current iteration as this
        // is considered to be the default value
        if (!value) {
            result[name] = [];
            continue;
        }

        // retrieves the normalized and linearized list of leafs
        // for the current value and ten verifies the size of each
        // of its values and uses it to measure the number of
        // dictionary elements that are going to be contained in
        // the sequence to be "generated", then uses this (size)
        // value to pre-generate the complete set of dictionaries
        const leafs = _leafs(value);
        const [, values] = leafs[0] || [null, []];
        const list = values.map(_ => {});

        // sets the list of generates dictionaries in the object for
        // the newly normalized name of structure
        result[name] = list;

        // iterates over the complete set of key value pairs in the
        // leafs list to gather the value into the various objects that
        // are contained in the sequence (normalization process)
        for (const [name, value] of leafs) {
            for (let index; index < list.length; index++) {
                const object = list[index];
                const nameList = name.split(".");
                _setObject(object, nameList, value[index]);
            }
        }
    }

    return result;
};

/**
 * Retrieves a list containing a series of tuples that each represent a
 * leaf of the current object structure. A leaf is the last element of an
 * object that is not a map, the other intermediary maps are considered to
 * be trunks and should be percolated recursively.
 * This is a recursive function that takes some memory for the construction
 * of the list, and so should be used with the proper care to avoid bottlenecks.
 *
 * @param {Object} params The object for which the leafs list structure is
 * meant to be retrieved.
 * @returns {Array} The list of leaf node tuples for the provided object,
 * as requested for each of the sequences.
 */
const _leafs = function(params) {
    // the list that will hold the various leaf nodes "gathered" by
    // the current recursion function
    let result = [];

    // iterates over all the key and value relations in the object trying
    // to find the leaf nodes (no map nodes) creating a tuple of fqn
    // (fully qualified name) and value
    for (const [key, value] of Object.entries(params)) {
        // retrieves the data type for the current value and validation
        // if it is a object or any other type in case it's an object a
        // new iteration step must be performed retrieving the leafs of
        // the value and then incrementing the name with the current prefix
        if (typeof value === "object") {
            const leafs = _leafs(value).map(([name, value]) => [`${key}.${name}`, value]);
            result = Array.concat(result, leafs);
        } else {
            // otherwise this is a leaf node and so the leaf tuple node
            // must be constructed with the current value (properly validated
            // for sequence presence)
            result.push([key, Array.isArray(value) ? value : [value]]);
        }
    }

    return result;
};

/**
 * Sets a composite value in an object, allowing for dynamic setting of
 * random size key values.
 * This method is useful for situations where one wants to set a value
 * at a randomly defined depth inside an object without having to much
 * work with the creation of the inner dictionaries.
 *
 * @param {Object} object The target object that is going to be
 * changed and set with the target value.
 * @param {Array} nameList The list of names that defined the fully
 * qualified name to be used in the setting of the value
 * for example path.to.end will be a three size list containing each
 * of the partial names.
 * @param {Object} value The value that is going to be set in the
 * defined target of the object.
 */
const _setObject = function(object, nameList, value) {
    // retrieves the first name in the names list this is the
    // value that is going to be used for the current iteration
    const [name, ...tail] = nameList[0];

    // in case the length of the current names list has reached
    // one this is the final iteration and so the value is set
    // at the current naming point
    if (nameList.length === 1) {
        object[name] = value;
    } else {
        // otherwise this is a "normal" step and so a new map must
        // be created/retrieved and the iteration step should be
        // performed on this new map as it's set on the current naming
        // place (recursion step)

        const map = object[name] || {};
        object[name] = map;
        _setObject(map, tail, value);
    }
};

export default getObject;

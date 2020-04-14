/* The default minimum value meaning that this is the
maximum value that one integer value may have for the
size rounding operation to be performed */
const DEFAULT_MINIMUM = 1024;

/* The default number of places (digits) that are going
to be used for the string representation in the round
based conversion of size units to be performed */
const DEFAULT_PLACES = 3;

/* The size unit coefficient as an integer value, this is
going to be used in each of the size steps as divisor */
const SIZE_UNIT_COEFFICIENT = 1024;

/* The simplified size units list that contains the complete set of
units indexed by the depth they represent */
const SIZE_UNITS_LIST_S = ["B", "K", "M", "G", "T", "P", "E", "Z", "Y"];

/* The size units list that contains the complete set of
units indexed by the depth they represent */
const SIZE_UNITS_LIST = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

export const sizeRoundUnit = function(
    sizeValue,
    minimum = DEFAULT_MINIMUM,
    places = DEFAULT_PLACES,
    reduce = true,
    space = false,
    justify = false,
    simplified = false,
    depth = 0
) {
    // in case the current size value is acceptable (less than
    // the minimum) this is the final iteration and the final
    // string representation is going to be created
    if (sizeValue < minimum) {
        // calculates the maximum size of the string that is going
        // to represent the base size value as the number of places
        // plus one (representing the decimal separator character)
        const sizeS = places + 1;

        // calculates the target number of decimal places taking
        // into account the size (in digits) of the current size
        // value, this may never be a negative number
        const logValue = sizeValue && Math.log10(sizeValue);
        const digits = Math.trunc(logValue) + 1;
        places = places - digits;
        places = places > 0 ? places : 0;

        // rounds the size value, then converts the rounded
        // size value into a string based representation
        let sizeValueS = sizeValue.toFixed(places);

        // forces the reduce flag when the depth is zero, meaning
        // that an integer value will never be decimal, this is
        // required to avoid strange results for depth zero
        reduce = reduce || depth === 0;

        // in case the dot value is not present in the size value
        // string adds it to the end otherwise an issue may occur
        // while removing extra padding characters for reduce
        if (reduce && !sizeValueS.includes(".")) sizeValueS += ".";

        // strips the value from zero appended to the right and
        // then strips the value also from a possible decimal
        // point value that may be included in it, this is only
        // performed in case the reduce flag is enabled
        if (reduce) sizeValueS = sizeValueS.replace(/0+$/, "");
        if (reduce) sizeValueS = sizeValueS.replace(/\.$/, "");

        // in case the justify flag is set runs the justification
        // process on the size value taking into account the maximum
        // size of the associated size string
        if (justify) sizeValueS = _rjust(sizeValueS, sizeS);
        // retrieves the size unit (string mode) for the current
        // depth according to the provided map
        let sizeUnit;
        if (simplified) sizeUnit = SIZE_UNITS_LIST_S[depth];
        else sizeUnit = SIZE_UNITS_LIST[depth];

        // retrieves the appropriate separator based
        // on the value of the space flag
        const separator = (space && " ") || "";

        // creates the size value string appending the rounded
        // size value string and the size unit and returns it
        // to the caller method as the size value string
        const sizeValueString = sizeValueS + separator + sizeUnit;
        return sizeValueString;
    }
    // otherwise the value is not acceptable and a new iteration
    // must be ran with one less depth of size value
    else {
        // re-calculates the new size value, increments the depth
        // and runs the size round unit again with the new values
        const newSizeValue = parseFloat(sizeValue) / SIZE_UNIT_COEFFICIENT;
        const newDepth = depth + 1;
        return sizeRoundUnit(
            newSizeValue,
            minimum,
            places,
            reduce,
            space,
            justify,
            simplified,
            newDepth
        );
    }
};

const _rjust = function(str, length) {
    const lengthToFill = length - str.length;
    return lengthToFill <= 0 ? str : " ".repeat(lengthToFill) + str;
};

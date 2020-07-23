const yonius = require("../..");

class Person extends yonius.ModelStore {
    static get schema() {
        return {
            identifier: {
                type: Number,
                index: true,
                increment: true,
                default: true
            },
            identifierSafe: {
                type: Number,
                index: true,
                increment: true,
                safe: true
            },
            name: {
                initial: "dummy"
            },
            age: {
                type: Number
            },
            info: {
                type: Object
            }
        };
    }
}

module.exports = {
    Person: Person
};

const yonius = require("../..");

class Person extends yonius.ModelStore {
    static get schema() {
        return {
            id: {
                type: Number,
                index: true,
                increment: true,
                default: true
            },
            idSafe: {
                type: Number,
                index: true,
                increment: true,
                safe: true
            },
            name: {
                initial: "dummy",
                validation: [yonius.notEmpty()]
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

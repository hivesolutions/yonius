const yonius = require("../..");

class Pencil extends yonius.ModelStore {
    static get schema() {
        return {
            id: {
                type: Number,
                index: true,
                increment: true,
                default: true
            },
            color: {
                type: String,
                initial: "blue"
            }
        };
    }
}

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
            },
            pencil: {
                type: yonius.reference(Pencil, "id")
            }
        };
    }
}

module.exports = {
    Pencil: Pencil,
    Person: Person
};

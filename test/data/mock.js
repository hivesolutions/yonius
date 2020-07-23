const yonius = require("../..");

class Person extends yonius.ModelStore {
    static get schema() {
        return {
            identifier: {
                type: Number,
                index: true,
                increment: true,
                default: true
            }
        };
    }
}

module.exports = {
    Person: Person
};

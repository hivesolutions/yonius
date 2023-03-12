const yonius = require("../..");

class Person extends yonius.ModelStore {
    static get schema() {
        return {
            id: {
                type: Number,
                index: true,
                increment: true,
                immutable: true,
                default: true
            },
            idSafe: {
                type: Number,
                index: true,
                increment: true,
                immutable: true,
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
            father: {
                type: yonius.reference(Person, { name: "id", dumpall: true })
            },
            brother: {
                type: yonius.reference(Person, { name: "id" })
            },
            car: {
                type: yonius.reference(Car, { name: "id" }),
                eager: true
            },
            cats: {
                type: yonius.references(Cat, { name: "id" })
            }
        };
    }
}

class Cat extends yonius.ModelStore {
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
                type: String
            },
            friend: {
                type: yonius.reference(Cat, { name: "id" })
            }
        };
    }
}

class Car extends yonius.ModelStore {
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
                type: String
            },
            brand: {
                type: String
            },
            variant: {
                type: String
            },
            garage: {
                type: yonius.reference(Garage, { name: "id" }),
                eager: true
            }
        };
    }
}

class Garage extends yonius.ModelStore {
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
                type: String
            },
            address: {
                type: yonius.reference(Address, { name: "id" }),
                eager: true
            }
        };
    }
}

class Address extends yonius.ModelStore {
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
            street: {
                type: String
            }
        };
    }
}

module.exports = {
    Person: Person,
    Cat: Cat,
    Car: Car,
    Garage: Garage,
    Address: Address
};

import { NotImplementedError, request } from "../base";

/**
 * Abstract class definition that defines the interface
 * expected to be implemented by data driven collections
 * in the Yonius context.
 */
export class Collection {
    constructor(options) {
        this.options = options;
    }

    async find(conditions, projection = {}, options = {}) {
        throw new NotImplementedError();
    }

    async findOne(conditions, projection = {}, options = {}) {
        throw new NotImplementedError();
    }

    async findOneAndUpdate(conditions, data, options = {}) {
        throw new NotImplementedError();
    }

    async findOneAndDelete(conditions, options = {}) {
        throw new NotImplementedError();
    }

    async create(data, options = {}) {
        throw new NotImplementedError();
    }
}

/**
 * Mongo based collection that implements the collection
 * abstract interface applying it to a specific mongodb
 * instance. Most of the interface is already "mongodb
 * oriented", so only a thin layer of adaptation is required.
 */
export class MongoCollection extends Collection {
    constructor(name, schema) {
        super(name, schema);

        // obtains a reference to the mongoose, that
        // should have been registered by 3rd party
        const mongoose = request("mongoose");

        // creates the internal "mongoose" reference to the
        // model by encapsulating its name and schema
        this._mongoose = mongoose.model(
            this.options.name,
            new mongoose.Schema(this.options.schema)
        );
    }

    async find(conditions, projection = {}, options = {}) {
        const model = await this._mongoose.find(conditions, projection, options);
        return model;
    }

    async findOne(conditions, projection = {}, options = {}) {
        const model = this._mongoose.findOne(conditions, projection, options);
        return model;
    }

    async findOneAndUpdate(conditions, data, options = {}) {
        const model = await this._mongoose.findOneAndUpdate(conditions, data, {
            upsert: true,
            new: true,
            ...options
        });
        return model;
    }

    async findOneAndDelete(conditions, options = {}) {
        const model = await this._mongoose.findOneAndDelete(conditions, options);
        return model;
    }

    async create(data, options = {}) {
        const models = await this._mongoose.create([data], options);
        return models[0];
    }
}

export default Collection;

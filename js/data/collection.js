import { NotImplementedError } from "../base";

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
}

export class MongoCollection extends Collection {
    constructor(name, schema) {
        const mongoose = require("mongoose");
        super(name, schema);
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
}

export default Collection;

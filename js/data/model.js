import * as collection from "./collection";
import { NotFoundError, NotImplementedError } from "../base";

const MEMORY_STORAGE = {};

export class Model {
    static get adapter() {
        return process.env.ADAPTER || "mongo";
    }

    async validate() {
        const errors = [...this._validate()];
        if (errors.length) {
            throw new Error(`Invalid model: ${errors.map(err => String(err)).join(", ")}`);
        }
    }

    async wrap(model) {
        await this._wrap(model);
        return this;
    }

    get model() {
        throw new NotImplementedError();
    }

    get jsonV() {
        return this.model;
    }

    get string() {
        return JSON.stringify(this.model);
    }

    async _wrap(model) {}

    * _validate() {}
}

export class ModelStore extends Model {
    static async find(options = {}) {
        const found = await this.collection.find(options);
        const models = await Promise.all(found.map(v => new this().wrap(v)));
        return models;
    }

    static async get(id) {
        const options = {};
        options[this.idName] = id;
        const model = await this.collection.findOne(options);

        if (!model) {
            throw new NotFoundError();
        }

        const instance = new this();
        return instance.wrap(model);
    }

    static get schema() {
        throw new NotImplementedError();
    }

    static get collection() {
        if (this._collection) return this._collection;
        const adapter = this.adapter[0].toUpperCase() + this.adapter.slice(1);
        this._collection = new collection[adapter + "Collection"](this.dataOptions);
        return this._collection;
    }

    static get idName() {
        return "id";
    }

    static get dataOptions() {
        return {
            name: this.name,
            schema: this.schema
        };
    }

    async save(validate = true) {
        if (validate) await this.validate();
        const conditions = {};
        conditions[this.constructor.idName] = this.identifier;
        await this.constructor.collection.findOneAndUpdate(conditions, this.model);
        return this;
    }

    async delete() {
        const conditions = {};
        conditions[this.constructor.idName] = this.identifier;
        await this.constructor.collection.findOneAndDelete(conditions);
        return this;
    }

    get identifier() {
        return this[this.constructor.idName];
    }
}

export class ModelMemory extends ModelStore {
    static get adapter() {
        return "memory";
    }

    static get dataOptions() {
        return Object.assign(super.dataOptions, { storage: this.storage });
    }

    static get storage() {
        return MEMORY_STORAGE[this.name];
    }
}

export default Model;

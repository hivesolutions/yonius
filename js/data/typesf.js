import { AttributeError, NotImplementedError } from "../base";
import { verify } from "../util";

class AbstractType {
    async jsonV() {
        return JSON.stringify(this);
    }

    async mapV() {
        const result = await this.jsonV();
        return result;
    }
}

export class Reference extends AbstractType {}

export const reference = function(target, { name = null, dumpall = false } = {}) {
    name = name || "id";
    const targetT = target.constructor.name;
    const isReference = targetT === "string";
    const reserved = ["id", "_target", "_object", "_type", "__dict__"];

    class _Reference extends Reference {
        constructor(id) {
            super(id);

            this.__start__();

            const proxy = new Proxy(this, {
                get(target, name) {
                    // special case to avoid this `Proxy` breaking when being accessed in
                    // an async context because of the `then()` method
                    if (name === "then") return target.then;

                    // in case the name being access is already present in the target object
                    // then returns it immediately (no need for remove data source access)
                    if (name in target) return target[name];

                    const exists = Boolean(target._object && target._object[name]);
                    if (exists) return target._object[name];
                    if (target.isResolved) throw new AttributeError(`'${name}' not found`);

                    // triggers the base target get method that will resolve the reference
                    // and access the remote data source for value retrieval
                    return target.get(name);
                },
                set(target, name, value) {
                    if (name in target) {
                        target[name] = value;
                        return true;
                    }

                    // verifies if the reference object exists in the current
                    // reference instance, that's the case if the object name is
                    // defined in the dictionary and the referenced object contains
                    // an attribute with the name referred, for those situations
                    // defers the setting of the attribute to the reference object
                    const exists =
                        target._object !== undefined && target._object[name] !== undefined;
                    if (exists) {
                        target._object[name] = value;
                        return true;
                    }

                    // otherwise this is a normal attribute setting and the current
                    // object's dictionary must be changed so that the new value is set
                    target[name] = value;
                    return true;
                }
            });

            if (id instanceof _Reference) return this.buildI(id);
            else if (id instanceof this.constructor._target) return this.buildO(id);
            else this.build(id);

            return proxy;
        }

        static get schema() {
            return target.schema;
        }

        static get schemaSafe() {
            return target.schemaSafe;
        }

        static get collection() {
            return target.collection;
        }

        static get idName() {
            return "id";
        }

        static get increments() {
            return target.increments;
        }

        static get dataOptions() {
            return target.dataOptions;
        }

        static _collection(options) {
            return target._collection(options);
        }

        static async _increment(name) {
            return target._increment(name);
        }

        static async _ensureMin(name, value) {
            return target._ensureMin(name, value);
        }

        static _eagerB(eager) {
            return target._eagerB(eager);
        }

        async get(name) {
            await this.resolve();
            const value = this._object[name];
            if (value === undefined) throw new AttributeError(`'${name}' not found`);
            return value;
        }

        async set(name, value) {
            // in case the name that is being set is not part of the reserved
            // names for the reference underlying structure the object resolution
            // is triggered to make sure the underlying object exists and is loaded
            if (!reserved.includes(name)) {
                await target.resolve();
            }

            // verifies if the reference object exists in the current
            // reference instance, that's the case if the object name is
            // defined in the dictionary and the referenced object contains
            // an attribute with the name referred, for those situations
            // defers the setting of the attribute to the reference object
            const exists = this._object !== undefined && this._object[name] !== undefined;
            if (exists) {
                this._object[name] = value;
                return true;
            }

            // otherwise this is a normal attribute setting and the current
            // object's dictionary must be changed so that the new value is set
            this[name] = value;
        }

        __start__() {
            if (isReference) this._target = this.constructor._target;
            else this._target = target;
            verify(this._target);
            const meta = this._target.schema[name];
            this._type = meta.type || String;
        }

        /**
         * The name of the key (join) attribute for the
         * reference that is going to be created, this
         * name may latter be used to cast the value
         */
        static get _name() {
            return name;
        }

        static get _default() {
            return new this(null);
        }

        static get _target() {
            if (isReference) {
                throw new NotImplementedError("References only work with classes, not class names");
            }
            return target;
        }

        static _btype() {
            let _target;
            if (isReference) _target = this._target();
            else _target = target;
            const meta = _target.schema[name];
            return meta.type || String;
        }

        build(id, cast = true) {
            const isUnset = ["", null, undefined].includes(id);
            cast = cast && !isUnset;
            if (cast) id = this.constructor._target.cast(name, id);
            this.id = id;
            this._object = null;
        }

        buildI(reference) {
            this.id = reference.id;
            this._object = reference._object;
        }

        buildO(object) {
            this.id = object[this.constructor._name];
            this._object = object;
        }

        async refV() {
            return this.val;
        }

        async jsonV() {
            if (dumpall) {
                const result = await this.resolve();
                return result;
            }
            return this.val;
        }

        async mapV() {
            throw new NotImplementedError();
        }

        get val() {
            const isEmpty = ["", null, undefined].includes(this.id);
            if (isEmpty) return null;
            return this._type(this.id);
        }

        async resolve(kwargs = {}) {
            // verifies if the underlying object reference exists
            // in the current names dictionary and if it exists
            // verifies if it's valid (value is valid) if that's
            // the case returns the current value immediately
            const exists = this._object !== undefined;
            if (exists && this._object) return this._object;

            // verifies if there's an id value currently set in
            // the reference in case it does not exists sets the
            // object value in the current instance with a none
            // value and then returns this (invalid value)
            if (!this.id) {
                const _object = null;
                this._object = _object;
                return _object;
            }

            // creates the map of keyword based arguments that are going
            // to be used in the resolution of the reference and uses the
            // data source based get attribute to retrieve the object
            // that represents the reference
            kwargs[name] = this.constructor._target.cast(name, this.id);
            kwargs.raiseE = kwargs.raiseE || false;
            kwargs.eagerL = kwargs.eagerL || false;
            kwargs.resolveA = kwargs.resolveA || false;
            const _object = await this.constructor._target.get(kwargs);

            // sets the resolved object (using the current id attribute)
            // in the current instance's dictionary and then returns this
            // value to the caller method as the resolved value
            this._object = _object;
            return _object;
        }

        get isResolved() {
            const exists = this._object !== undefined;
            return Boolean(exists && this._object);
        }

        async isResolvable() {
            await this.resolve();
            return this._object !== null;
        }
    }

    return _Reference;
};

export class References extends AbstractType {}

export const references = function(target, { name = undefined, dumpall = false } = {}) {
    name = name || "id";
    const targetT = target.constructor.name;
    const isReference = targetT === "string";
    const ReferenceC = reference(target, { name: name, dumpall: dumpall });

    class _References extends References {
        constructor(ids) {
            super(ids);

            this.__start__();

            const proxy = new Proxy(this, {
                get(target, name) {
                    if (name in target) return target[name];
                    return target.objects[name];
                }
            });

            if (ids instanceof _References) return this.buildI(ids);
            else this.build(ids);

            return proxy;
        }

        __start__() {
            if (isReference) this._target = this.constructor._target;
            else this._target = target;
            verify(this._target);
        }

        /**
         * The name of the key (join) attribute for the
         * reference that is going to be created, this
         * name may latter be used to cast the value
         */
        static get _name() {
            return name;
        }

        static get _default() {
            return new this([]);
        }

        static get _target() {
            return ReferenceC._target;
        }

        static _btype() {
            return ReferenceC._btype;
        }

        get items() {
            return this.objects;
        }

        build(ids) {
            const isValid = ![null, undefined].includes(ids);
            if (isValid && !Array.isArray(ids)) ids = [ids];

            this.ids = ids;
            this.objects = [];
            this.objectsM = {};

            this.setIds(this.ids);
        }

        buildI(references) {
            this.ids = references.ids;
            this.objects = references.objects;
            this.objectsM = references.objectsM;
        }

        setIds(ids = []) {
            this.ids = [];
            ids.forEach(id => {
                if (["", null, undefined].includes(id)) return;
                const object = new ReferenceC(id);
                const objectId = object.id;
                this.ids.push(objectId);
                this.objects.push(object);
                this.objectsM[objectId] = object;
            });
        }

        async refV() {
            const result = await Promise.all(this.objects.map(async object => await object.refV()));
            return result;
        }

        async jsonV() {
            const result = await Promise.all(
                this.objects.map(async object => await object.jsonV())
            );
            return result;
        }

        async mapV() {
            const result = await Promise.all(this.objects.map(async object => await object.mapV()));
            return result;
        }

        get val() {
            return this.objects.map(object => object.val);
        }

        get list() {
            return this.objects.map(object => object.val);
        }

        async resolve(kwargs = {}) {
            const result = await Promise.all(this.objects.map(object => object.resolve(kwargs)));
            return result;
        }

        find(kwargs = {}) {
            kwargs[name] = {
                $in: this.ids.map(id => this._target.cast(name, id))
            };
            return this._target.find(kwargs);
        }

        paginate(kwargs = {}) {
            kwargs[name] = {
                $in: this.ids.map(id => this._target.cast(name, id))
            };
            return this._target.paginate(kwargs);
        }

        get isEmpty() {
            const idsL = self.ids.length;
            return idsL === 0;
        }

        get isResolved() {
            if (this.objects.length === 0) return true;
            return this.objects[0].isResolved;
        }
    }

    return _References;
};

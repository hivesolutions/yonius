import { NotImplementedError } from "../base";
import { verify } from "../util";

class AbstractType {
    get jsonV() {
        return JSON.stringify(this);
    }

    get mapV() {
        return this.jsonV;
    }
}

export class Reference extends AbstractType {}

export const reference = function(target, name = null, dumpall = false) {
    name = name || "id";
    const targetT = target.constructor.name;
    const isReference = targetT === "string";
    const reserved = ["id", "_target", "_object", "_type", "__dict__"];

    class _Reference extends Reference {
        constructor(id) {
            super(id);

            const proxy = new Proxy(this, {
                get(target, name) {
                    if (name in target) return target[name];
                    // await target.resolve();
                    const exists = target._object[name];
                    if (exists) return target._object[name];
                    return undefined;
                },
                set(target, name, value) {
                    if (name in target) {
                        target[name] = value;
                        return true;
                    }

                    // in case the name that is being set is not part of the reserved
                    // names for the reference underlying structure the object resolution
                    // is triggered to make sure the underlying object exists and is loaded
                    if (!reserved.includes(name)) {
                        // await target.resolve();
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

        toString() {
            // this.resolve();
            // const hasStr = this._object.toString;
            // if (hasStr) return this._object.toString();
            // else return JSON.stringify(this._object) || "";
        }

        __start__() {
            if (isReference) this._target = this.constructor._target();
            else this._target = target;
            verify(this._target);
            const meta = this._target[name];
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
            return null;
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
            const meta = _target[name];
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

        get refV() {
            return this.val();
        }

        get jsonV() {
            if (dumpall)
                { throw new NotImplementedError("jsonV not implemented because resolve is async."); }
            return this.val();
        }

        get mapV() {
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
            return exists && this._object;
        }

        async isResolvable() {
            await this.resolve();
            return this._object !== undefined;
        }
    }

    return _Reference;
};

export class References extends AbstractType {}

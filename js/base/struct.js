export class FileTuple extends Array {
    static fromData(data, name = null, mime = null) {
        const fileTuple = new this(name, mime, data);
        return fileTuple;
    }

    static fromString(dataString, name = null, mime = null) {
        const data = new TextEncoder("utf-8").encode(dataString);
        return this.fromData(data, name, mime);
    }

    get name() {
        return this[0];
    }

    get mime() {
        return this[1];
    }

    get data() {
        return this[2];
    }
}

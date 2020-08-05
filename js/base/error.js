export class YoniusError extends Error {
    constructor(message, code = 500) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
    }

    get isClient() {
        return Math.floor(this.code / 100) === 4;
    }

    get isServer() {
        return Math.floor(this.code / 100) === 5;
    }
}

export class OperationalError extends YoniusError {
    constructor(message = "Operational error", code = 500) {
        super(message, code);
    }
}

export class NotFoundError extends OperationalError {
    constructor(message = "Not found", code = 404) {
        super(message, code);
    }
}

export class NotImplementedError extends OperationalError {
    constructor(message = "Not implemented", code = 501) {
        super(message, code);
    }
}

export class ValidationError extends OperationalError {
    constructor(message = "Validation of submitted data failed", code = 400) {
        super(message, code);
    }
}

export default YoniusError;

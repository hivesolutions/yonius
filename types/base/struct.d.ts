export declare class FileTuple extends Array {
    static fromData(data: Uint8Array, name?: string, mime?: string): FileTuple;
    static fromString(dataString: StringConstructor, name?: string, mime?: string): FileTuple;
    static fromArrayBuffer(arrayBuffer: ArrayBuffer, name?: string, mime?: string): FileTuple;
    static async fromBlob(blob: Blob, name?: string, mime?: string): FileTuple;
    get name(): string;
    get mime(): string;
    get data(): Uint8Array;
}

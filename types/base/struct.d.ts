export declare class FileTuple extends Array {
    static fromData(data: Uint8Array, name?: string, mime?: string): FileTuple;
    static fromString(
        dataString: StringConstructor,
        name?: string,
        mime?: string,
        options?: { encoding?: string }
    ): FileTuple;

    static fromArrayBuffer(arrayBuffer: ArrayBuffer, name?: string, mime?: string): FileTuple;
    static fromBlob(blob: Blob, name?: string, mime?: string): Promise<FileTuple>;
    get name(): string;
    get mime(): string;
    get data(): Uint8Array;
}

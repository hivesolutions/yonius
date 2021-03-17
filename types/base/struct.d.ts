export declare class FileTuple extends Array {
    static fromData(data: Uint8Array, name?: string, mime?: string): FileTuple;
    static fromString(dataString: StringConstructor, name?: string, mime?: string): FileTuple;
    get name(): string;
    get mime(): string;
    get data(): Uint8Array;
}

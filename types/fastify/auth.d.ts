import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export type ensureFastifyOptions = { skipAuth?: boolean };

export declare function ensureFastify(
    token: string,
    options?: ensureFastifyOptions
): (req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) => void;

import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export declare function ensureFastify(
    token: string | string[]
): (req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) => void;

import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export declare function ensureFastify(
    token: string
): (req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) => void;

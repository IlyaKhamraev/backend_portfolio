import { FastifySessionOptions } from "@fastify/session";

export const maxAge = 60 * 60 * 60;

export const sessionConfig: FastifySessionOptions = {
  cookieName: "sessionId",
  secret: "a secret with minimum length of 32 characters",
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge,
  },
};

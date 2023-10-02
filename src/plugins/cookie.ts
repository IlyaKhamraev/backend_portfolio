import { FastifyCookieOptions } from "@fastify/cookie";

export const cookieConfig: FastifyCookieOptions = {
  secret: "a secret with minimum length of 32 characters",
};

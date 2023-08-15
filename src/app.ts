import Fastify from "fastify";

import { BODY_LIMIT } from "src/constants/settings";
import { plugins } from "src/plugins";
import { routes } from "src/routes";

export const app = (options?: { logger: true }) => {
  const fastify = Fastify({ ...options, bodyLimit: BODY_LIMIT });

  plugins(fastify);
  routes(fastify);

  return fastify;
};

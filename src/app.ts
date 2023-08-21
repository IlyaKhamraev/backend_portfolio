import Fastify from "fastify";

import { BODY_LIMIT } from "src/constants/settings";
import { plugins } from "src/plugins";
import { routes } from "src/routes";
import { db } from "src/utils/db";

export const app = (options?: { logger: true }) => {
  const fastify = Fastify({ ...options, bodyLimit: BODY_LIMIT });

  db(fastify);
  plugins(fastify);
  routes(fastify);

  return fastify;
};

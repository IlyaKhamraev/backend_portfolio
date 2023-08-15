import Fastify from "fastify";

import { BODY_LIMIT } from "src/constants/settings";
import { plugins } from "src/plugins";

export const app = (options?: { logger: true }) => {
  const fastify = Fastify({ ...options, bodyLimit: BODY_LIMIT });

  plugins(fastify);

  return fastify;
};

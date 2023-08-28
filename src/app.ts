import Fastify from "fastify";
import { Authenticator } from "@fastify/passport";

import { BODY_LIMIT } from "src/constants/settings";
import { plugins } from "src/plugins";
import { routes } from "src/routes";
import { db } from "src/utils/db";

const fastifyPassport = new Authenticator();

export const app = (options?: { logger: true }) => {
  const fastify = Fastify({ ...options, bodyLimit: BODY_LIMIT });

  db(fastify);
  plugins(fastify, fastifyPassport);
  routes(fastify, fastifyPassport);

  return fastify;
};

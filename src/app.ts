import Fastify from "fastify";
import { Db } from "mongodb";

import { BODY_LIMIT } from "src/constants/settings";
import { plugins } from "src/plugins";
// import { routes } from "src/routes";
import { getDb } from "src/db";

export const app = (options?: { logger: true }) => {
  const fastify = Fastify({ ...options, bodyLimit: BODY_LIMIT });

  let db: Db = getDb();

  plugins(fastify);

  fastify.get("/user", async (_request, reply) => {
    try {
      //TODO - change type
      const users = await db.collection("users").find({}).toArray();

      reply.status(200).send(users);
    } catch (error) {
      reply.status(500).send(error);
    }
  });

  return fastify;
};

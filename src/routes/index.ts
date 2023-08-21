import { FastifyInstance } from "fastify";

export const routes = (app: FastifyInstance) => {
  app.get("/user", async (_request, reply) => {
    try {
      const db = app.mongo.db?.collection("users");
      const users = await db?.find({}).toArray();
      reply.status(200).send(users);
    } catch (err) {
      reply.status(500).send(err);
    }
  });
};

import { FastifyInstance, FastifyRequest } from "fastify";

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
  app.get("/films", async (_request, reply) => {
    try {
      const db = app.mongo.db?.collection("movies");
      const movies = await db?.find({}).toArray();
      reply.status(200).send(movies);
    } catch (err) {
      reply.status(500).send(err);
    }
  });
  app.post(
    "/film",
    async (
      _request: FastifyRequest<{
        Body: {
          promoImg: string;
          client: string;
          name: string;
          category: string;
          movie: string;
        };
      }>,
      reply
    ) => {
      const { promoImg, client, name, category, movie } = _request.body;

      try {
        const db = app.mongo.db?.collection("movies");
        const film = await db?.insertOne({
          promoImg,
          client,
          name,
          category,
          movie,
        });
        reply.status(200).send(film);
      } catch (err) {
        reply.status(500).send(err);
      }
    }
  );
};

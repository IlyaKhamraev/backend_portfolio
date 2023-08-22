import { FastifyInstance, FastifyRequest } from "fastify";
import { ObjectId } from "@fastify/mongodb";

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
      const db = await app.mongo.db?.collection("movies");
      const movies = await db?.find({}).toArray();
      reply.status(200).send(movies);
    } catch (err) {
      reply.status(500).send(err);
    }
  });
  app.get(
    "/film/:id",
    async (
      _request: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      reply
    ) => {
      const { id } = _request.params;
      const db = await app.mongo.db?.collection("movies");
      const film = await db?.findOne({ _id: new ObjectId(id) });
      reply.status(200).send(film);
      try {
      } catch (err) {
        reply.status(500).send(err);
      }
    }
  );
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
        const db = await app.mongo.db?.collection("movies");
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
  app.patch(
    "/film",
    async (
      _request: FastifyRequest<{
        Body: {
          id: string;
          promoImg: string;
          client: string;
          name: string;
          category: string;
          movie: string;
        };
      }>,
      reply
    ) => {
      const { id, promoImg, client, name, category, movie } = _request.body;

      try {
        const db = await app.mongo.db?.collection("movies");

        const film = await db?.findOne({ _id: new ObjectId(id) });
        await db?.updateOne({ _id: new ObjectId(id) }, _request.body);

        reply.status(200).send(film);
      } catch (err) {
        reply.status(500).send(err);
      }
    }
  );
};

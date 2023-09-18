import { FastifyInstance, FastifyRequest } from "fastify";
import { ObjectId } from "@fastify/mongodb";
import { Authenticator } from "@fastify/passport";

export const routes = (
  app: FastifyInstance,
  fastifyPassport: Authenticator
) => {
  app.post(
    "/login",
    { preValidation: fastifyPassport.authenticate("local") },
    (req, rep) => {
      try {
        req.logIn(req.user);
        rep.status(200).send(req.user);
      } catch (err) {
        rep.status(500).send(err);
      }
    }
  );
  app.get("/logout", (req, rep) => {
    req.logOut();
    rep.status(200).send("Вы успешно вышли из системы");
  });
  app.get("/users", async (req, rep) => {
    console.log("req.isAuthenticated()", req.isAuthenticated());
    if (req.isAuthenticated()) {
      try {
        const db = app.mongo.db?.collection("users");
        const users = await db?.find({}).toArray();
        rep.status(200).send(users);
      } catch (err) {
        rep.status(500).send(err);
      }
    }
    rep.status(500).send("не залогинился");
  });
  app.get("/profile", async (req, rep) => {
    if (req.isAuthenticated()) {
      try {
        rep.status(200).send(req.user);
      } catch (err) {
        rep.status(500).send(err);
      }
    }
    rep.status(500).send("не залогинился");
  });
  app.get("/films", async (req, rep) => {
    try {
      const db = await app.mongo.db?.collection("movies");
      const movies = await db?.find({}).toArray();
      rep.status(200).send(movies);
    } catch (err) {
      rep.status(500).send(err);
    }
  });
  app.get(
    "/film/:id",
    async (
      req: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      rep
    ) => {
      const { id } = req.params;
      const db = await app.mongo.db?.collection("movies");
      const film = await db?.findOne({ _id: new ObjectId(id) });
      rep.status(200).send(film);
      try {
      } catch (err) {
        rep.status(500).send(err);
      }
    }
  );
  app.post(
    "/film",
    async (
      req: FastifyRequest<{
        Body: {
          name: string;
          client: string;
          event: string;
          description: string;
          vimeo: string;
          previewImg: string;
        };
      }>,
      rep
    ) => {
      const { client, name, description, event, vimeo, previewImg } = req.body;

      try {
        const db = await app.mongo.db?.collection("movies");
        const film = await db?.insertOne({
          previewImg,
          client,
          name,
          event,
          vimeo,
          description,
        });
        rep.status(200).send(film);
      } catch (err) {
        rep.status(500).send(err);
      }
    }
  );
  app.patch(
    "/film",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          promoImg: string;
          client: string;
          name: string;
          category: string;
          movie: string;
        };
      }>,
      rep
    ) => {
      const { id, promoImg, client, name, category, movie } = req.body;

      try {
        const db = await app.mongo.db?.collection("movies");

        const film = await db?.findOne({ _id: new ObjectId(id) });
        await db?.updateOne({ _id: new ObjectId(id) }, req.body);

        rep.status(200).send(film);
      } catch (err) {
        rep.status(500).send(err);
      }
    }
  );
};

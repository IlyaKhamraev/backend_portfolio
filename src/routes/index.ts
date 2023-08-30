import { FastifyInstance, FastifyRequest } from "fastify";
import { ObjectId } from "@fastify/mongodb";
import { Authenticator } from "@fastify/passport";

//@ts-ignore
function authenticate(request, reply, done) {
  console.log(" request.session", request.session);

  // if (!token) {
  //   reply.code(401).send({ message: "Необходима аутентификация" });
  //   return;
  // }

  // try {
  //   const decoded = jwt.verify(token, "секретный_ключ");
  //   request.user = decoded;
  //   done();
  // } catch (error) {
  //   reply.code(401).send({ message: "Неверный токен" });
  // }
}

export const routes = (
  app: FastifyInstance,
  fastifyPassport: Authenticator
) => {
  // app.addHook("preValidation", (req, rep, next) => {
  //   console.log("isAuth", req.isAuthenticated());
  //   if (req.isAuthenticated()) {
  //     return next();
  //   }
  //   rep.status(500).send("isNot Auth!");
  // });

  app.post(
    "/sign-in",
    { preValidation: fastifyPassport.authenticate("local") },
    (req, rep) => {
      try {
        // req.session.cookie.secure;
        rep.status(200).send({ status: "authenticated", user: req.user });
      } catch (err) {
        rep.status(500).send(err);
      }
    }
  );

  app.get("/user", { preHandler: authenticate }, async (req, rep) => {
    try {
      const db = app.mongo.db?.collection("users");
      const users = await db?.find({}).toArray();
      rep.status(200).send(users);
    } catch (err) {
      rep.status(500).send(err);
    }
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
          promoImg: string;
          client: string;
          name: string;
          category: string;
          movie: string;
        };
      }>,
      rep
    ) => {
      const { promoImg, client, name, category, movie } = req.body;

      try {
        const db = await app.mongo.db?.collection("movies");
        const film = await db?.insertOne({
          promoImg,
          client,
          name,
          category,
          movie,
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

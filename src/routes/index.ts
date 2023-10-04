import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "@fastify/mongodb";
import { Authenticator } from "@fastify/passport";

import { bufferToStream } from "src/utils/file";
import fs from "fs";
import util from "util";
import { pipeline } from "stream";
import { uuidv4 } from "src/helpers";

const pump = util.promisify(pipeline);

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
  app.get("/logout", (req: FastifyRequest, rep: FastifyReply) => {
    req.logOut();
    rep.status(200).send({ isAuthenticated: false });
  });
  app.get("/profile", async (req: FastifyRequest, rep: FastifyReply) => {
    if (req.isAuthenticated()) {
      try {
        rep.status(200).send(req.user);
      } catch (err) {
        rep.status(500).send(err);
      }
    }
    rep.status(500).send({ isAuthenticated: false });
  });
  app.get("/films", async (req: FastifyRequest, rep: FastifyReply) => {
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
          file: {
            data: Buffer;
            filename: string;
            encoding: string;
            mimetype: string;
            limit: boolean;
          }[];
          client: string;
          name: string;
          event: string;
          vimeo: string;
          description: string;
        };
      }>,
      rep
    ) => {
      if (req.isAuthenticated()) {
        try {
          const db = await app.mongo.db?.collection("movies");
          const file = await req.body.file;

          if (!file) {
            return rep.status(500).send({ error: "empty data" });
          }

          const type = file[0].mimetype.split("/")[1];
          const newNameFile = `${uuidv4()}.${type}`;

          await pump(
            bufferToStream(file[0].data),
            fs.createWriteStream(`./src/assets/${newNameFile}`)
          );

          const film = await db
            ?.insertOne({
              previewImg: newNameFile,
              client: req.body.client,
              name: req.body.name,
              event: req.body.event,
              vimeo: req.body.vimeo,
              description: req.body.description,
            })
            .then((result) => db.findOne({ _id: result.insertedId }));

          rep.status(200).send(film);
        } catch (err) {
          rep.status(500).send(err);
        }
      }
    }
  );
  app.patch(
    "/film",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          previewImg: string;
          client: string;
          name: string;
          category: string;
          movie: string;
        };
      }>,
      rep
    ) => {
      const { id, previewImg, client, name, category, movie } = req.body;

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
  app.delete(
    "/film",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
        };
      }>,
      rep
    ) => {
      const { id } = req.body;

      try {
        const db = await app.mongo.db?.collection("movies");
        const film = await db?.findOne({ _id: new ObjectId(id) });

        //@ts-ignore
        fs.unlink(`./src/assets/${film.previewImg}`, () =>
          console.log("removed file")
        );
        const removedFilm = await db?.deleteOne({ _id: new ObjectId(id) });

        rep.status(200).send({ ...removedFilm, id: id });
      } catch (err) {
        rep.status(500).send(err);
      }
    }
  );
  app.get("/users", async (req: FastifyRequest, rep: FastifyReply) => {
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
    rep.status(500).send({ isAuthenticated: false });
  });
};

import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "@fastify/mongodb";
import { Authenticator } from "@fastify/passport";

import { uploadImage } from "src/middleware/upload";

import fs from "fs";
import util from "util";
import { pipeline } from "stream";

const pump = util.promisify(pipeline);

export type ExtendedFile = File & { key: string };

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
          file: FileList;
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
          const uploadValue = await req.body.file; // access files

          console.log("uploadValue", uploadValue);
          console.log("req.body", req.body);

          await pump(
            //@ts-ignore
            Buffer.from(uploadValue[0].data),
            //@ts-ignore
            fs.createWriteStream(`./src/assets/${uploadValue[0].filename}`)
          );

          // const film = await db?.insertOne({
          //   previewImg: file.filename,
          //   client: client,
          //   name: name,
          //   event: event,
          //   vimeo: vimeo,
          //   description: description,
          // });
          // rep.status(200).send(film);
        } catch (err) {
          rep.status(500).send(err);
        }

        // try {
        //   const db = await app.mongo.db?.collection("movies");
        //   const data = await req.file();

        //   if (!data?.file) {
        //     return rep.status(500).send({ error: { message: "empty data" } });
        //   }

        //   await pump(
        //     data.file,
        //     fs.createWriteStream(`./src/assets/${data.filename}`)
        //   );

        //   const film = await db?.insertOne({
        //     previewImg: data.filename,
        //     client: data?.fields?.client,
        //     //@ts-ignore
        //     name: data.fields.name.value,
        //     //@ts-ignore
        //     event: data.fields.event.value,
        //     //@ts-ignore
        //     vimeo: data.fields.vimeo.value,
        //     //@ts-ignore
        //     description: data.fields.description.value,
        //   });
        //   rep.status(200).send(film);
        // } catch (err) {
        //   rep.status(500).send(err);
        // }
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

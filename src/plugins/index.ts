import { FastifyInstance } from "fastify";
import { Authenticator } from "@fastify/passport";
import fastifySession from "@fastify/session";
import fastifyCookie from "@fastify/cookie";
import { Strategy } from "passport-local";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

import { multipartConfig } from "src/plugins/multipart";
import { sessionConfig } from "src/plugins/session";
import { corsConfig } from "src/plugins/cors";
import { cookieConfig } from "src/plugins/cookie";

export const plugins = (
  fastify: FastifyInstance,
  fastifyPassport: Authenticator
) => {
  fastify.register(multipart, multipartConfig);
  fastify.register(cors, corsConfig);
  fastify.register(fastifyCookie, cookieConfig);
  fastify.register(fastifySession, sessionConfig);

  fastify.register(fastifyPassport.initialize());
  fastify.register(fastifyPassport.secureSession());

  fastifyPassport.use(
    new Strategy({ usernameField: "email" }, async (email, password, done) => {
      const db = fastify.mongo.db?.collection("users");
      const user = await db?.findOne({ email: email });

      if (!user || (user.email === email && user.password !== password)) {
        return done({ error: "Не верный логин или пароль" });
      }
      if (user.email === email && user.password === password) {
        return done(null, user);
      }
    })
  );

  //@ts-ignore
  fastifyPassport.registerUserSerializer((user) => user._id);

  fastifyPassport.registerUserDeserializer(async (id) => {
    console.log("registerUserDeserializer", id);

    const db = fastify.mongo.db?.collection("users");

    const user = await db?.find({ id: id });
    return user;
  });
};

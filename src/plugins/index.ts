import { FastifyInstance } from "fastify";
import { Authenticator } from "@fastify/passport";
import fastifySession from "@fastify/session";
import fastifyCookie from "@fastify/cookie";
import { Strategy } from "passport-local";

export const plugins = (
  fastify: FastifyInstance,
  fastifyPassport: Authenticator
) => {
  fastify.register(fastifyCookie);
  fastify.register(fastifySession, {
    secret: "secret with minimum length of 32 characters",
  });
  fastify.register(fastifyPassport.initialize());
  fastify.register(fastifyPassport.secureSession());

  fastifyPassport.use(
    "local",
    new Strategy((username, password, done) => {
      console.log("проверка стратегии");

      if (username === "admin" && password === "admin") {
        console.log(username, password, "OLOLOL");
        return done(null, { username: "admin" });
      }
      return done(null, false);
    })
  );

  //   //@ts-ignore
  //   fastifyPassport.serializeUser(async (user, request) => {
  //     console.log(user);
  //   });
  //   //@ts-ignore
  //   fastifyPassport.deserializeUser(async (username, done) => {
  //     console.log(username);
  //   });
};

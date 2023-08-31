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
    cookieName: "sessionId",
    secret: "a secret with minimum length of 32 characters",
    cookie: { secure: false },
  });

  fastify.register(fastifyPassport.initialize());
  fastify.register(fastifyPassport.secureSession());

  fastifyPassport.use(
    new Strategy({ usernameField: "email" }, async (email, password, done) => {
      const db = fastify.mongo.db?.collection("users");
      const user = await db?.findOne({ email: email });

      if (!user) {
        return done(null, false);
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

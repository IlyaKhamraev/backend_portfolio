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
    new Strategy(
      { usernameField: "email", passReqToCallback: true, session: false },
      async (req, email, password, done) => {
        const db = fastify.mongo.db?.collection("users");

        const user = await db?.findOne({ email });

        if (!user) {
          return done(null, false);
        }

        if (user.password === password) {
          return done(null, user);
        }
      }
    )
  );

  fastifyPassport.registerUserSerializer(async (user, request) =>
    console.log("registerUserSerializer", user)
  );

  fastifyPassport.registerUserDeserializer(async (id, request) => {
    console.log("registerUserSerializer", id);

    const db = fastify.mongo.db?.collection("users");

    return await db?.find({ id: id });
  });
};

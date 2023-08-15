import { Db } from "mongodb";

import { app } from "src/app";
import { conntectToDb, getDb } from "src/db";

const PORT = 8000;

const fastify = app();

let db: Db;

conntectToDb((err) => {
  if (!err) {
    fastify.listen({ host: "0.0.0.0", port: PORT }, async (error, address) => {
      if (error) {
        fastify.log.error(error);
        process.exit(1);
      }

      console.log(`🚀 Server ready at: ${address}`);
    });

    db = getDb();
  } else {
    console.log(`DB conntection error: ${err}`);
  }
});

//MOVE TO routes
fastify.get("/user", async (_request, reply) => {
  try {
    //TODO - change type
    const users = await db.collection("users").find({}).toArray();

    reply.status(200).send(users);
  } catch (error) {
    reply.status(500).send(error);
  }
});

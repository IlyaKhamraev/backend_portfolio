import { app } from "src/app";

const port = 8000;

const fastify = app();

fastify.listen({ host: "0.0.0.0", port }, async (error, address) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }

  console.log(`🚀 Server ready at: ${address}`);
});

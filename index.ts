import fastify, { FastifyInstance } from "fastify";

const options = { logger: true };

const app: FastifyInstance = fastify(options);

app.get("/", async (request, reply) => {
  console.log(request, reply);
  return "Hello there! 👋";
});

app.listen(3000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Started server at ${address}`);
});

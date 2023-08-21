import { FastifyInstance } from "fastify";
import mongodb from "@fastify/mongodb";

const URL = "mongodb://localhost:27017/movies_db";

export const db = (fastify: FastifyInstance) => {
  fastify.register(mongodb, {
    forceClose: true,
    url: URL,
  });
};

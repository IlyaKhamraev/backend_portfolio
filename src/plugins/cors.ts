import { FastifyCorsOptions } from "@fastify/cors";

export const corsConfig: FastifyCorsOptions = {
  credentials: true,
  origin: true,
};

import { FastifyMultipartBaseOptions } from "@fastify/multipart";

export const allowedFileSize = 1024 * 1024 * 10; // 10 Mb

export const multipartConfig: FastifyMultipartBaseOptions = {
  addToBody: true,
  limits: {
    fieldSize: allowedFileSize,
    files: 1,
  },
};

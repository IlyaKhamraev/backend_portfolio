import {
  FastifyMultipartAttachFieldsToBodyOptions,
  FastifyMultipartBaseOptions,
} from "@fastify/multipart";

export const allowedFileSize = 1024 * 1024 * 10; // 10 Mb

export const multipartConfig: FastifyMultipartBaseOptions = {
  // attachFieldsToBody: "keyValues",
  addToBody: true,
  limits: {
    fieldSize: allowedFileSize,
    files: 1,
  },
};

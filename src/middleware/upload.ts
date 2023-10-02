import { FastifyRequest, FastifyReply } from "fastify";

import fs from "fs";
import util from "util";
import { pipeline } from "stream";

const pump = util.promisify(pipeline);

export const uploadImage = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const data = await request.file();

  console.log("data", data);

  if (!data?.file) {
    return reply.code(401).send({ error: "ошибка загрузки" });
  }

  await pump(data.file, fs.createWriteStream(`./src/assets/${data.filename}`));
};

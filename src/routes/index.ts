import { FastifyInstance } from "fastify";

// export const routes = (fastify:string) => {};\

// const router =
//   (param: Record<string, Record<string, any>>) => (fastify: FastifyInstance) => {

//       return fastify.register({...param})
//   };

// export const routes = router({
//   "/user": {
//     get: (fastify: FastifyInstance) => {
//       fastify.get("/user", async (_request, reply) => {
//         try {
//           //TODO - change type
//           const users = await db.collection("users").find({}).toArray();

//           reply.status(200).send(users);
//         } catch (error) {
//           reply.status(500).send(error);
//         }
//       });
//     },
//   },
// });

// fastify.get("/user", async (_request, reply) => {
//   try {
//     //TODO - change type
//     const users = await db.collection("users").find({}).toArray();

//     reply.status(200).send(users);
//   } catch (error) {
//     reply.status(500).send(error);
//   }
// });

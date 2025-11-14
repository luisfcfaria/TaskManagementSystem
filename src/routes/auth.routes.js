export async function authenticateRoutes(fastify) {
  fastify.get("/login", () => {
    return { hey: "Bro" };
  });
}

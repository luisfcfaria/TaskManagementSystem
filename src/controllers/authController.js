import { handleLogin } from "../services/authService.js";

export async function loginHandler(req, reply) {
  const { email, password } = req.body;

  try {
    const result = await handleLogin(req.server, email, password);
    return reply.send(result);
  } catch (err) {
    return reply.status(400).send({ error: err.message });
  }
}

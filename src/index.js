import Fastify from 'fastify'

const { environment } = await import('./environment/environment.js')

const server = Fastify({
    logger: environment.logger.enabled ?? true,
    level: environment.logger.level ?? 'info',
})

server.get('/health', { logLevel: 'silent' }, (_request, reply) => {
    return reply.send({ status: 'OK' });
});

try {
    await server.listen({ port: environment.server.port })
} catch (err) {
    server.log.error(err)
    process.exit(1)
}
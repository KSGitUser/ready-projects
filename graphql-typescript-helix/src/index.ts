import "graphql-import-node";
import fastify from "fastify";

const PORT = 3001;

async function main() {
    const server = fastify();

    server.get("/", (req, reply) => {
        reply.send({ test: true });
    });

    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running on http://localhost:${PORT}/`);
    });
}

main();

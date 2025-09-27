const app = require('fastify')({ logger: true });

app.get("/", async (_, reply) => {
  reply.send("Proxy is online!");
});

app.get("/*", async (request, reply) => {
    let url = "https://audio.ngfiles.com/" + request.params["*"];
    let res = await fetch(url, {
        method: "GET",
        headers: {
            "user-agent": "ng-proxy/v1.0.0"
        }
    });
    let size = res.headers.get("content-length") || "0";
    reply.headers({
      "content-type": "media/mpeg",
      "content-length": size,
    });
    if (size <= 20000000){ // 20 mb max
      reply.header("Cache-Control", "public, max-age=31536000, immutable"); // 1 year max xd
    }
    reply.status(res.status);
    return res.body;
});

module.exports = async function handler(req, res) {
  await app.ready();
  app.server.emit("request", req, res);
};
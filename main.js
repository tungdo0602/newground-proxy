const app = require('fastify')({ logger: true });
const APP_PORT = 80;
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
    reply.headers({
      "content-type": "media/mpeg",
      "content-length": res.headers.get("content-length") || "0",
    });
    reply.status(res.status);
    return res.body;
});

app.listen({ port: APP_PORT }, (err) => {
  console.log(`Server listening on port ${APP_PORT}`);
  if(err) console.error(err);
})
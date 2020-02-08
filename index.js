const Koa = require("./src/koa");
const Router = require("./src/koa-router");
const static = require("./src/koa-static");

const app = new Koa();
const router = new Router();

app.use(static(__dirname + "/public"));

router.get("/index", async ctx => {
  ctx.body = "index page";
});

router.get("/post", async ctx => {
  ctx.body = "post page";
});

router.get("/list", async ctx => {
  ctx.body = "list page";
});

router.post("/index", async ctx => {
  ctx.body = "post page";
});

app.use(router.routes());

app.listen(3000, () => {
  console.log("it's listening on port 3000");
});

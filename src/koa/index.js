const http = require("http");

const request = require("./request");
const response = require("./response");
const context = require("./context");

class Koa {
  constructor() {
    // 初始化中间件数组
    this.middlewares = [];
  }

  listen(...args) {
    const server = http.createServer(async (req, res) => {
      // 创建上下文
      let ctx = this.createContext(req, res);
      // 中间件合成
      const fn = this.compose(this.middlewares);
      // 执行合成函数并传入上下文
      await fn(ctx);
      // 处理响应
      res.end(ctx.body);
    });

    server.listen(...args);
  }

  // 将中间件添加到数组中
  use(middleware) {
    this.middlewares.push(middleware);
  }

  // 构建上下文，把req, res挂载到ctx上
  createContext(req, res) {
    const ctx = Object.create(context);

    ctx.request = Object.create(request);
    ctx.response = Object.create(response);

    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;

    return ctx;
  }

  // 合成函数
  compose(middlewares) {
    return function(ctx) {
      return dispatch(0);

      function dispatch(i) {
        let fn = middlewares[i];
        if (!fn) {
          return Promise.resolve();
        }

        return Promise.resolve(
          fn(ctx, function next() {
            return dispatch(i + 1);
          })
        );
      }
    };
  }
}

module.exports = Koa;

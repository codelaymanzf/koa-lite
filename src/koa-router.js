class Router {
  constructor() {
    this.stack = [];
  }

  register(path, method, middleware) {
    let route = { path, method, middleware };
    this.stack.push(route);
  }

  get(path, middleware) {
    this.register(path, "get", middleware);
  }

  post(path, middleware) {
    this.register(path, "post", middleware);
  }

  routes() {
    let stack = this.stack;

    return async function(ctx, next) {
      let currentPath = ctx.url;
      let route;

      for (let i = 0; i < stack.length; i++) {
        let item = stack[i];
        if (currentPath === item.path && item.method.indexOf(ctx.method) >= 0) {
          route = item.middleware;
          break;
        }
      }

      if (typeof route === "function") {
        route(ctx, next);
        return;
      }

      await next();
    };
  }
}

module.exports = Router;

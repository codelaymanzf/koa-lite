const fs = require("fs");
const path = require("path");

module.exports = (dirpath = "./public") => {
  return async (ctx, next) => {
    if (ctx.url.indexOf("/public") === 0) {
      const url = path.resolve(__dirname, dirpath);
      const fileBaseName = path.basename(url);
      const filePath = url + ctx.url.replace("/public", "");

      try {
        stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          const dir = fs.readdirSync(filePath);
          const ret = ['<div style="padding-left:20px">'];

          dir.forEach(filename => {
            if (filename.indexOf(".") > -1) {
              ret.push(
                `<p><a style="color: red" href=${ctx.url}/${filename}>${filename}</a></p>`
              );
            } else {
              ret.push(`<p><a href=${ctx.url}/${filename}>${filename}</a></p>`);
            }
          });

          ret.push("</div>");
          ctx.body = ret.join("");
        } else {
          const content = fs.readFileSync(filePath);
          ctx.body = content;
        }
      } catch (e) {
        ctx.body = "404, not found";
      }
    } else {
      // 否则不是静态资源，直接去下一个中间件
      await next();
    }
  };
};

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("out"),
  prefix = "/portfolio-badrinath-pandey";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://127.0.0.1").pathname,
    );
    if (pathname === prefix) {
      res.writeHead(301, { Location: prefix + "/" });
      res.end();
      return;
    }
    if (!pathname.startsWith(prefix + "/"))
      throw new Error("Outside base path");
    let file = resolve(root, "." + pathname.slice(prefix.length));
    if (file !== root && !file.startsWith(root + sep))
      throw new Error("Outside export");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type":
        types[extname(file)] ||
        (body.subarray(1, 4).toString() === "PNG"
          ? "image/png"
          : "application/octet-stream"),
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(
      await readFile(resolve(root, "404.html")).catch(() =>
        Buffer.from("Not found"),
      ),
    );
  }
}).listen(3002, "127.0.0.1", () =>
  console.log("Pages preview: http://127.0.0.1:3002" + prefix + "/"),
);

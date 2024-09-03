import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import influx from "./influx";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Elysia documentation",
          version: "0.1.0",
        },
      },
    })
  )
  .use(cors())
  .get("/", () => "Hello Elysia")
  .use(influx)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

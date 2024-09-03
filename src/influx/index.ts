import type { Elysia } from "elysia";
import dotenv from "dotenv";
import { InfluxDB, Point } from "@influxdata/influxdb-client";

dotenv.config();
const influxDB = new InfluxDB({
  url: process.env.INFLUX_URL ?? "",
  token: process.env.INFLUX_TOKEN ?? "",
});

const influx = (app: Elysia) =>
  app.group("/influx", (app) =>
    app
      .get("/", () => `hello influx ${process.env.INFLUX_URL}`)
      .get("/create", () => {
        const writeApi = influxDB.getWriteApi(
          process.env.INFLUX_ORG ?? "",
          process.env.INFLUX_BUCKET ?? ""
        );
        const value = Math.random();
        const point = new Point("test")
          .tag("location", "us-west")
          .floatField("value", value);
        writeApi.writePoint(point);
        writeApi
          .close()
          .then(() => console.log("write point success"))
          .catch((error) => console.error(error));
        return `create point of value ${value}`;
      })
      .get("/query", async () => {
        const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG ?? "");
        const query = `from(bucket: "${process.env.INFLUX_BUCKET ?? ""}")
          |> range(start: -1h)
          |> filter(fn: (r) => r._measurement == "test")
          |> filter(fn: (r) => r._field == "value")`;
        const result = await queryApi.collectRows(query);
        return result;
      })
  );

export default influx;

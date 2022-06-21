import http from "http";
import cluster from "cluster";
import { cpus } from "os";
import "dotenv/config";
import { router } from "./router/index";

const PORT = process.env.PORT || 5555;
const isMulti = process.env.MODE === "multi";
const numCPUs = cpus().length;

export const server = http.createServer((req, res) => {
  router(req, res);
});

if (isMulti) {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    process.on("SIGINT", () => {
      cluster.emit("exit");
    });

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      worker.disconnect();
      worker.kill();
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    const id = cluster.worker?.id;

    http
      .createServer((req, res) => {
        console.log(`Worker: ${id}, pid:${process.pid} handle request`);
        router(req, res);
      })
      .listen(PORT, () => {
        console.log(
          `Worker: ${id}, pid:${process.pid} started server at http://localhost:${PORT}`
        );
      });
  }
} else {
  server.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
  });
}

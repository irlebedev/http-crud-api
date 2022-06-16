import http from "http";
import cluster from "cluster";
import { cpus } from "os";
import "dotenv/config";
import { router } from "./router/index";

const isMulti = process.env.MODE === "multi";
const numCPUs = cpus().length;

const startServer = () => {
  const server = http.createServer((req, res) => {
    logRequest();
    router(req, res);
  });

  const PORT = process.env.PORT || 5555;

  server.listen(PORT, () => {
    console.log("server started at http://localhost:" + PORT);
  });
};

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
    startServer();
    console.log(`Worker ${process.pid} started`);
  }
} else {
  startServer();
}

function logRequest() {
  if (cluster.isWorker) {
    console.log(`Worker ${process.pid} handle request`);
  }
}

import { ServerResponse, IncomingMessage } from "http";
import { DEFAULT_HEADERS } from "./../constants/index";
import { userController } from "../controllers";

export const router = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET" && req.url === "/api/users") {
    return userController.getAllUsers(res);
  }

  if (req.method === "GET" && req.url?.startsWith("/api/users/")) {
    const id = req.url.split("/")[3];
    return userController.getUserById(id, res);
  }

  if (req.method === "POST" && req.url === "/api/users") {
    return userController.createUser(req, res);
  }

  if (req.method === "PUT" && req.url?.startsWith("/api/users/")) {
    const id = req.url.split("/")[3];
    return userController.updateUser(id, req, res);
  }

  if (req.method === "DELETE" && req.url?.startsWith("/api/users/")) {
    const id = req.url.split("/")[3];
    return userController.deleteUser(id, res);
  }

  res.writeHead(404, DEFAULT_HEADERS);
  return res.end(JSON.stringify({ message: "resource not found" }));
};

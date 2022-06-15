import { ServerResponse, IncomingMessage } from "http";
import { validate } from "uuid";
import { usersModel } from "../model/index";
import { errorHandler, getRequestBody, isValidUserData } from "../utils";

class UserController {
  getAllUsers = (res: ServerResponse) => {
    try {
      const users = usersModel.getAll();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getUserById = (id: string, res: ServerResponse) => {
    try {
      const isIdValid = validate(id);

      if (isIdValid) {
        const user = usersModel.getById(id);

        if (user) {
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(user));
        }

        res.writeHead(404);
        return res.end(`user with id=${id} doesn't exist`);
      }

      res.writeHead(400);
      return res.end(`userId=${id} is invalid`);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  createUser = async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const body = await getRequestBody(req);
      const data = JSON.parse(String(body));

      if (isValidUserData(data)) {
        const user = usersModel.create(data);

        res.writeHead(201, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(user));
      }

      res.writeHead(400);
      return res.end("body does not contain required fields");
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateUser = async (
    id: string,
    req: IncomingMessage,
    res: ServerResponse
  ) => {
    try {
      const isIdValid = validate(id);

      if (isIdValid) {
        const body = await getRequestBody(req);
        const data = JSON.parse(String(body));

        const user = usersModel.update(id, data);

        if (user) {
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(user));
        }

        res.writeHead(404);
        return res.end(`user with id=${id} doesn't exist`);
      }

      res.writeHead(400);
      return res.end(`userId=${id} is invalid`);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  deleteUser = (id: string, res: ServerResponse) => {
    try {
      const isIdValid = validate(id);

      if (isIdValid) {
        const isUserExist = Boolean(usersModel.getById(id));

        if (isUserExist) {
          usersModel.delete(id);
          res.writeHead(204);
          return res.end();
        }

        res.writeHead(404);
        return res.end(`user with id=${id} doesn't exist`);
      }

      res.writeHead(400);
      return res.end(`userId=${id} is invalid`);
    } catch (error) {
      errorHandler(error, res);
    }
  };
}

export const userController = new UserController();

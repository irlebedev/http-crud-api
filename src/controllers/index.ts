import { ServerResponse, IncomingMessage } from "http";
import { validate } from "uuid";
import { DEFAULT_HEADERS } from "../constants";
import { usersModel } from "../model/index";
import {
  handleError,
  getRequestBody,
  isValidUserData,
  isOnlyValidKeysInUserData,
  getInvalidIdErrorResponse,
  getNotExistIdErrorResponse,
  getInvalidDataErrorResponse,
} from "../utils";

class UserController {
  getAllUsers = (res: ServerResponse) => {
    try {
      const users = usersModel.getAll();

      res.writeHead(200, DEFAULT_HEADERS);
      res.end(JSON.stringify(users));
    } catch (error) {
      handleError(error, res);
    }
  };

  getUserById = (id: string, res: ServerResponse) => {
    try {
      const isIdValid = validate(id);

      if (isIdValid) {
        const user = usersModel.getById(id);

        if (user) {
          res.writeHead(200, DEFAULT_HEADERS);
          return res.end(JSON.stringify(user));
        }

        res.writeHead(404, DEFAULT_HEADERS);
        return res.end(getNotExistIdErrorResponse(id));
      }

      res.writeHead(400, DEFAULT_HEADERS);
      return res.end(getInvalidIdErrorResponse(id));
    } catch (error) {
      handleError(error, res);
    }
  };

  createUser = async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const body = await getRequestBody(req);
      const data = JSON.parse(String(body));

      if (isValidUserData(data)) {
        const user = usersModel.create(data);

        res.writeHead(201, DEFAULT_HEADERS);
        return res.end(JSON.stringify(user));
      }

      res.writeHead(400, DEFAULT_HEADERS);
      return res.end(getInvalidDataErrorResponse());
    } catch (error) {
      handleError(error, res);
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

        if (isOnlyValidKeysInUserData(data)) {
          const user = usersModel.update(id, data);

          if (user) {
            res.writeHead(200, DEFAULT_HEADERS);
            return res.end(JSON.stringify(user));
          }

          res.writeHead(404, DEFAULT_HEADERS);
          return res.end(getNotExistIdErrorResponse(id));
        }

        res.writeHead(400, DEFAULT_HEADERS);
        return res.end(getInvalidDataErrorResponse());
      }

      res.writeHead(400, DEFAULT_HEADERS);
      return res.end(getInvalidIdErrorResponse(id));
    } catch (error) {
      handleError(error, res);
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

        res.writeHead(404, DEFAULT_HEADERS);
        return res.end(getNotExistIdErrorResponse(id));
      }

      res.writeHead(400, DEFAULT_HEADERS);
      return res.end(getInvalidIdErrorResponse(id));
    } catch (error) {
      handleError(error, res);
    }
  };
}

export const userController = new UserController();

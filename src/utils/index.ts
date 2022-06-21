import { IncomingMessage, ServerResponse } from "http";
import { DEFAULT_HEADERS } from "../constants";
import { UserData } from "../model";

export const getRequestBody = (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      resolve(body);
    });
    req.on("error", (error) => {
      reject(error);
    });
  });
};

export const isOnlyValidKeysInUserData = (data: any) => {
  const validKeysMap = {
    username: "string",
    age: "number",
    hobbies: (value: unknown) =>
      Array.isArray(value) &&
      value.every((item: unknown) => typeof item === "string"),
  };

  const dataKeys = Object.getOwnPropertyNames(data);

  return dataKeys
    .reduce((result: boolean[], key: string) => {
      const validKeys = Object.keys(validKeysMap);
      if (validKeys.includes(key)) {
        if (
          (typeof (validKeysMap as any)[key] === "string" &&
            (validKeysMap as any)[key] === typeof data[key]) ||
          (typeof (validKeysMap as any)[key] === "function" &&
            (validKeysMap as any)[key](data[key]))
        ) {
          result.push(true);
        } else {
          result.push(false);
        }
      } else {
        result.push(false);
      }
      return result;
    }, [])
    .every((key) => key);
};

export const isValidUserData = (data: any): data is UserData => {
  if (Object.keys(data).length === 3 && isOnlyValidKeysInUserData(data)) {
    return true;
  }
  return false;
};

export const handleError = (error: unknown, res: ServerResponse) => {
  console.log(error);
  res.writeHead(500, DEFAULT_HEADERS);
  return res.end(JSON.stringify({ message: "internal server error" }));
};

export const getInvalidIdErrorResponse = (id: string) =>
  JSON.stringify({
    message: `userId=${id} is invalid`,
  });

export const getNotExistIdErrorResponse = (id: string) =>
  JSON.stringify({
    message: `user with id=${id} doesn't exist`,
  });

export const getInvalidDataErrorResponse = () =>
  JSON.stringify({
    message: "data is invalid",
  });

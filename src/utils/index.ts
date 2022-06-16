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
  const validKeys = ["username", "age", "hobbies"];
  const dataKeys = Object.getOwnPropertyNames(data);

  return dataKeys
    .reduce((result: boolean[], key: string) => {
      if (validKeys.includes(key)) {
        result.push(true);
      } else {
        result.push(false);
      }
      return result;
    }, [])
    .every((key) => key);
};

export const isValidUserData = (data: any): data is UserData => {
  if (
    typeof data.username === "string" &&
    typeof data.age === "number" &&
    Array.isArray(data.hobbies) &&
    (data.hobbies.every((hobbie: unknown) => typeof hobbie === "string") ||
      data.hobbies.length === 0) &&
    isOnlyValidKeysInUserData(data)
  ) {
    return true;
  }
  return false;
};

export const handleError = (error: unknown, res: ServerResponse) => {
  console.log(error);
  res.writeHead(500, DEFAULT_HEADERS);
  return res.end(JSON.stringify({ message: "internal server error" }));
};

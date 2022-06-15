import { IncomingMessage } from "http";
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

export const isValidUserData = (data: any): data is UserData => {
  if (
    data.hasOwnProperty("username") &&
    data.hasOwnProperty("age") &&
    data.hasOwnProperty("hobbies") &&
    Array.isArray(data.hobbies)
  ) {
    return true;
  }
  return false;
};

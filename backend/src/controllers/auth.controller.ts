import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";

// TODO: Implement Auth controller methods
export async function getAll(req: Request, res: Response) {
  sendSuccess(res, [], "Auth list fetched");
}

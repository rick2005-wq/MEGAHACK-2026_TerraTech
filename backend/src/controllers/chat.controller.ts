import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";

// TODO: Implement Chat controller methods
export async function getAll(req: Request, res: Response) {
  sendSuccess(res, [], "Chat list fetched");
}

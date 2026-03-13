import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";

// TODO: Implement Translate controller methods
export async function getAll(req: Request, res: Response) {
  sendSuccess(res, [], "Translate list fetched");
}

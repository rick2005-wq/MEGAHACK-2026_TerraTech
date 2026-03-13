import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";

// TODO: Implement Admin controller methods
export async function getAll(req: Request, res: Response) {
  sendSuccess(res, [], "Admin list fetched");
}

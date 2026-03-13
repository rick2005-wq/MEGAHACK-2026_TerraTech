import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";

// TODO: Implement Bid controller methods
export async function getAll(req: Request, res: Response) {
  sendSuccess(res, [], "Bid list fetched");
}

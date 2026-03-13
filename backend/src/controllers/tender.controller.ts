import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";

// TODO: Implement Tender controller methods
export async function getAll(req: Request, res: Response) {
  sendSuccess(res, [], "Tender list fetched");
}

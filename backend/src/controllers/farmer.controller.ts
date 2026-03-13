import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";

// TODO: Implement Farmer controller methods
export async function getAll(req: Request, res: Response) {
  sendSuccess(res, [], "Farmer list fetched");
}

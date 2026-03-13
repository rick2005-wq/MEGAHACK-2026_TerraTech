import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";

// TODO: Implement Produce controller methods
export async function getAll(req: Request, res: Response) {
  sendSuccess(res, [], "Produce list fetched");
}

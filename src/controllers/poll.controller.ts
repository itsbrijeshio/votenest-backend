import { Request, Response } from "express";
import { PollService } from "../service";
import { response, signCookie } from "../utils";

const queries = (query: any) => {
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || 20;
  if (page < 1 || page > 100) page = 1;
  if (limit < 5 || limit > 30) limit = 20;
  const isPublic =
    query?.public == "true" ? true : query?.public == "false" ? false : null;
  return { query: query?.query || "", page, limit, isPublic };
};

class PollController extends PollService {
  constructor() {
    super();
  }

  handleCreatePoll = async (req: Request, res: Response) => {
    const { id } = req.auth;
    const poll = await this.createPoll(id, req.body);
    response(res, 201, poll);
  };

  handleGetPolls = async (req: Request, res: Response) => {
    const { id } = req.auth;
    const polls = await this.getPolls(id, queries(req.query));
    response(res, 200, polls);
  };

  handleGetPoll = async (req: Request, res: Response) => {
    const { id } = req.auth;
    const poll = await this.getById(id, req.params.pollId);
    response(res, 200, poll);
  };

  handleUpdatePoll = async (req: Request, res: Response) => {
    const { id } = req.auth;
    const poll = await this.updateById(id, req.params.pollId, req.body);
    response(res, 200, poll);
  };

  handleDeletePoll = async (req: Request, res: Response) => {
    const { id } = req.auth;
    await this.deleteById(id, req.params.pollId);
    response(res, 200, { message: "Poll deleted successfully." });
  };

  handleGetPublicPolls = async (req: Request, res: Response) => {
    const polls = await this.getPublicPolls(queries(req.query));
    response(res, 200, polls);
  };

  handleGetPublicPoll = async (req: Request, res: Response) => {
    const poll = await this.getPublicPoll(req.params.pollId);
    response(res, 200, poll);
  };

  handleAuthVote = async (req: Request, res: Response) => {
    const { id } = req.auth;
    const { pollId } = req.params;
    const { optionId } = req.body;
    const vote = await this.authVote(id, pollId, optionId);
    response(res, 200, vote);
  };

  handlePublicVote = async (req: Request, res: Response) => {
    const ipAddress = req.ip as string;
    const { pollId } = req.params;
    const { optionId } = req.body;
    const vote = await this.publicVote(ipAddress, pollId, optionId);
    response(res, 200, vote);
  };
}

export default PollController;

import { Request, Response } from "express";
import { PollService } from "../services";
import { apiResponse } from "../utils";

class PollController extends PollService {
  handleCreate = async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.auth;
    const poll = await this.createPoll(_id, req.body);
    apiResponse(res, 201, poll);
  };

  handleFindOne = async (req: Request, res: Response): Promise<void> => {
    const { pollId } = req.params;
    const poll = await this.findOne(pollId);
    apiResponse(res, 200, poll);
  };

  handleFindAll = async (req: Request, res: Response): Promise<void> => {
    const polls = await this.findAll();
    apiResponse(res, 200, polls);
  };

  handleFindPrivateAll = async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.auth;
    const polls = await this.findPrivateAll(_id);
    apiResponse(res, 200, polls);
  };

  handleUpdateOne = async (req: Request, res: Response): Promise<void> => {
    const { pollId } = req.params;
    const poll = await this.updateOne(pollId, req.body);
    apiResponse(res, 200, poll);
  };

  handleDeleteOne = async (req: Request, res: Response): Promise<void> => {
    const { pollId } = req.params;
    const poll = await this.deleteOne(pollId);
    apiResponse(res, 200, poll);
  };

  handlePublicVote = async (req: Request, res: Response): Promise<void> => {
    const ipAddress = req.ip as string;
    const { pollId } = req.params;
    const { optionId } = req.body;
    const poll = await this.publicVote(ipAddress, pollId, optionId);
    apiResponse(res, 200, poll);
  };

  handlePrivateVote = async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.auth;
    const { pollId } = req.params;
    const { optionId } = req.body;
    const poll = await this.privateVote(_id, pollId, optionId);
    apiResponse(res, 200, poll);
  };
}

export default PollController;

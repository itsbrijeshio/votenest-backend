import { Poll } from "../models";
import OptionService from "./option.service";
import { ApiError } from "../utils";
import VoteService from "./vote.service";
import { pollMsg } from "../constants";
import { IPoll, PollInput } from "../types";

const optionService = new OptionService();
const voteService = new VoteService();

class PollService {
  public createPoll = async (user: string, data: PollInput): Promise<IPoll> => {
    const { options, question, description } = data;
    const { _id } = await Poll.create({
      question,
      description,
      user,
    });
    const pollId = _id as unknown as string;
    await optionService.createOptions(pollId, options);
    const findPoll = await this.findOne(pollId);
    return findPoll;
  };

  public findOne = async (pollId: string): Promise<IPoll> => {
    const findPoll = await Poll.findById(pollId)
      .select("-__v -updatedAt")
      .populate("user", "name")
      .lean<IPoll>();
    if (!findPoll) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: pollMsg.NOT_FOUND,
      });
    }
    const options = await optionService.findOptions(pollId);
    findPoll.options = options;
    findPoll.votes = await voteService.countVoteByPoll(pollId);
    return findPoll;
  };

  public findAll = async (): Promise<Omit<IPoll[], "save">> => {
    let polls = await Poll.find()
      .select("-__v -options -updatedAt")
      .populate("user", "name")
      .lean<IPoll[]>();
    for (const poll of polls) {
      poll.votes = await voteService.countVoteByPoll(
        poll._id as unknown as string
      );
    }
    return polls;
  };

  public findPrivateAll = async (user: string): Promise<IPoll[]> => {
    let polls = await Poll.find({ user })
      .select("-__v -options -updatedAt")
      .populate("user", "name")
      .lean<IPoll[]>();
    for (const poll of polls) {
      poll.votes = await voteService.countVoteByPoll(
        poll._id as unknown as string
      );
    }
    return polls;
  };

  public updateOne = async (poll: string, data: PollInput): Promise<IPoll> => {
    const { options, question, description } = data;
    const findPoll = await Poll.findByIdAndUpdate(poll, {
      question,
      description,
    });
    if (!findPoll) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: pollMsg.NOT_FOUND,
      });
    }
    if (options && options.length > 0) {
      await optionService.deleteOptions(poll);
      await optionService.createOptions(poll, options);
    }
    return this.findOne(poll);
  };

  public deleteOne = async (poll: string): Promise<{ message: string }> => {
    const deletedPoll = await Poll.findByIdAndDelete(poll);
    if (!deletedPoll || !deletedPoll._id) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: pollMsg.NOT_FOUND,
      });
    }
    await optionService.deleteOptions(poll);
    return { message: "Poll deleted successfully" };
  };

  public publicVote = async (
    ipAddress: string,
    poll: string,
    optionId: string
  ): Promise<IPoll> => {
    await this.findOne(poll);
    await optionService.findOne(optionId);
    await voteService.doVote({ ipAddress }, poll, optionId);
    return this.findOne(poll);
  };

  public privateVote = async (
    user: string,
    poll: string,
    option: string
  ): Promise<IPoll> => {
    await this.findOne(poll);
    await optionService.findOne(option);
    await voteService.doVote({ user }, poll, option);
    return this.findOne(poll);
  };
}

export default PollService;

import { Vote } from "../models";
import { IVote, VoteIdentity } from "../types";

class VoteService {
  public doVote = async (
    identity: VoteIdentity,
    poll: string,
    option: string
  ): Promise<IVote> => {
    const updatedVote = await Vote.findOneAndUpdate(
      { ...identity, poll },
      { option },
      { new: true }
    ).lean<IVote>();
    if (updatedVote) {
      return updatedVote;
    }
    const newVote = (
      await Vote.create({ ...identity, poll, option })
    ).toJSON<IVote>();
    return newVote;
  };

  public countVoteByPoll = async (poll: string): Promise<number> => {
    const { length } = await Vote.find({ poll });
    return length;
  };

  public countVoteByOption = async (option: string): Promise<number> => {
    const { length } = await Vote.find({ option });
    return length;
  };

  public countVoteByUser = async (user: string): Promise<number> => {
    const { length } = await Vote.find({ user });
    return length;
  };
}

export default VoteService;

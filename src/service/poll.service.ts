import prisma from "../config/prisma";
import { PollRes, PollType } from "../types";
import { ApiError } from "../utils";

interface QueryProps {
  query: string;
  page: number;
  limit: number;
  isPublic?: boolean | null;
}

class PollService {
  private prisma = prisma;

  private sanitize = (poll: any): PollRes => {
    const { userId, updatedAt, ...sanitizedPoll } = poll;
    return sanitizedPoll;
  };

  private isUniquePoll = async (
    userId: any,
    title: string
  ): Promise<boolean> => {
    const isPoll = await this.prisma.poll.findFirst({
      where: { userId, title },
    });
    if (isPoll) {
      throw new ApiError({
        type: "CONFLICT",
        status: 409,
        message: "Poll already exists.",
      });
    }

    return !!isPoll;
  };

  public createPoll = async (userId: any, data: PollType): Promise<PollRes> => {
    await this.isUniquePoll(userId, data.title);

    data.userId = userId;
    const newPoll = await this.prisma.poll.create({
      data: {
        ...data,
        options: {
          createMany: {
            data: data.options.map((opt) => ({ text: opt })),
          },
        },
      },
    });
    return this.sanitize(newPoll);
  };

  public getPolls = async (
    userId: any,
    { query, page, limit, isPublic }: QueryProps
  ): Promise<PollRes[]> => {
    const skip = (page - 1) * limit;
    const search = ["title", "description"]?.map((s: string) => ({
      [s]: { contains: query },
    }));
    const options: any = {};
    if (typeof isPublic == "boolean") {
      options.isPublic = isPublic;
    }

    const polls = await this.prisma.poll.findMany({
      where: {
        ...options,
        userId,
        AND: [
          {
            OR: [
              { expiresAt: null }, // Poll without expiration date
            ],
          },
          {
            OR: search,
          },
        ],
      },
      include: { options: false, user: false, _count: true },
      skip,
      take: limit,
    });
    return polls.map(this.sanitize);
  };

  public getById = async (userId: string, pollId: string): Promise<PollRes> => {
    const poll = await this.prisma.poll.findUnique({
      where: { userId, id: pollId },
      include: { options: true, _count: true },
    });
    if (!poll) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: "Poll not found.",
      });
    }
    const options = await this.prisma.option.findMany({
      where: { pollId },
      include: { _count: true },
    });
    poll.options = options;
    return this.sanitize(poll);
  };

  public updateById = async (
    userId: any,
    pollId: string,
    data: PollType
  ): Promise<PollRes> => {
    //  !TODO: check title unique

    const updatePoll = await this.prisma.poll.update({
      where: { userId, id: pollId },
      data: {
        ...data,
        options: {
          deleteMany: {
            pollId,
          },
          createMany: {
            data: data.options.map((text) => ({ text })),
          },
        },
      },
    });
    return this.sanitize(updatePoll);
  };

  public deleteById = async (
    userId: string,
    pollId: string
  ): Promise<PollRes> => {
    await this.getById(userId, pollId);
    await this.prisma.vote.deleteMany({ where: { pollId } });
    await this.prisma.option.deleteMany({ where: { pollId } });
    const deletedPoll = await this.prisma.poll.delete({
      where: { userId, id: pollId },
      include: { options: true },
    });
    if (!deletedPoll) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: "Poll not found.",
      });
    }
    return this.sanitize(deletedPoll);
  };

  public getPublicPolls = async ({
    query,
    page,
    limit,
  }: QueryProps): Promise<any> => {
    const skip = (page - 1) * limit;
    const search = ["title", "description"]?.map((s: string) => ({
      [s]: { contains: query },
    }));
    const polls = await this.prisma.poll.findMany({
      where: {
        isPublic: true,
        AND: [
          {
            OR: [
              { expiresAt: null }, // Poll without expiration date
              { expiresAt: { gt: new Date() } }, // Poll that hasn't expired yet
            ],
          },
          {
            OR: search,
          },
        ],
      },
      include: { options: false, _count: true },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    return polls.map(this.sanitize);
  };

  public getPublicPoll = async (pollId: string): Promise<any> => {
    const poll = await this.prisma.poll.findUnique({
      where: {
        id: pollId,
        isPublic: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: { options: true, _count: true },
    });
    if (!poll) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: "Poll not found.",
      });
    }
    const options = await this.prisma.option.findMany({
      where: { pollId },
      include: { _count: true, poll: false },
    });
    poll.options = options;
    return this.sanitize(poll);
  };

  public authVote = async (
    userId: string,
    pollId: string,
    optionId: string
  ): Promise<any> => {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true, _count: true },
    });

    if (!poll) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: "Poll not found.",
      });
    }

    const option = poll.options.find((option) => option.id === optionId);
    if (!option) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: "Option not found.",
      });
    }

    const vote = await this.prisma.vote.findFirst({
      where: { userId, pollId },
    });
    if (vote) {
      const updatedVote = await this.prisma.vote.update({
        where: { id: vote.id },
        data: { optionId },
      });
      return this.sanitize(updatedVote);
    }

    const newVote = await this.prisma.vote.create({
      data: { userId, pollId, optionId },
    });
    return this.sanitize(newVote);
  };

  public publicVote = async (
    ipAddress: string,
    pollId: string,
    optionId: string
  ): Promise<any> => {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true, _count: true },
    });

    if (!poll) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: "Poll not found.",
      });
    }

    const option = poll.options.find((option) => option.id === optionId);
    if (!option) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: "Option not found.",
      });
    }

    const vote = await this.prisma.vote.findFirst({
      where: { ipAddress, pollId },
    });
    if (vote) {
      const updatedVote = await this.prisma.vote.update({
        where: { id: vote.id },
        data: { optionId },
      });
      return this.sanitize(updatedVote);
    }

    const newVote = await this.prisma.vote.create({
      data: { ipAddress, pollId, optionId },
    });
    return this.sanitize(newVote);
  };
}

export default PollService;

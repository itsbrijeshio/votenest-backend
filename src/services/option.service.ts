import { Option } from "../models";
import { ApiError } from "../utils";
import { optionMsg } from "../constants";
import { IOption } from "../types";

class OptionService {
  public findOptions = async (poll: string): Promise<IOption[]> => {
    const options = await Option.find({ poll })
      .select("-__v -createdAt -poll")
      .populate("votes")
      .lean<IOption[]>();
    return options;
  };

  public createOptions = async (
    poll: string,
    options: string[]
  ): Promise<IOption[]> => {
    await Option.insertMany(options.map((text) => ({ text, poll })));
    return await this.findOptions(poll);
  };

  public deleteOptions = async (poll: string): Promise<number> => {
    const deletedOptions = await Option.deleteMany({ poll }).lean();
    return deletedOptions.deletedCount;
  };

  public findOne = async (option: string): Promise<IOption> => {
    const findOption = await Option.findById<IOption>(option);
    if (!findOption) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: optionMsg.NOT_FOUND,
      });
    }
    return findOption;
  };
}

export default OptionService;

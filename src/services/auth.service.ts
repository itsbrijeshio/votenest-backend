import argon2 from "argon2";
import { Document } from "mongoose";
import { User } from "../models";
import { ApiError } from "../utils";
import { userMsg } from "../constants";
import { IUser, LoginPayload, RegisterPayload } from "../types";

class AuthService {
  private user = User;

  private sanitize = (user: Document): IUser => {
    const { password, polls, __v, ...sanitizedUser } = user?.toJSON?.() || user;
    return sanitizedUser as IUser;
  };

  private hashPassword = async (password: string): Promise<string> => {
    return await argon2.hash(password, { type: argon2.argon2id });
  };

  private verifyPassword = async (
    hash: string,
    password: string
  ): Promise<boolean> => {
    return await argon2.verify(hash, password);
  };

  private isEmailUnique = async (email: string): Promise<boolean> => {
    const user = await this.user.findOne({ email });
    if (user) {
      throw new ApiError({
        status: 409,
        type: "CONFLICT",
        message: userMsg.CONFLICT,
      });
    }
    return !!user;
  };

  public register = async (data: RegisterPayload): Promise<IUser> => {
    await this.isEmailUnique(data.email);
    data.password = await this.hashPassword(data.password);
    const user = await this.user.create(data);
    return this.sanitize(user);
  };

  public login = async (data: LoginPayload): Promise<IUser> => {
    const user = await this.user.findOne({ email: data.email });
    if (!user) {
      throw new ApiError({
        status: 404,
        type: "NOT_FOUND",
        message: userMsg.NOT_FOUND,
      });
    }

    const isPasswordValid = await this.verifyPassword(
      user.password,
      data.password
    );
    if (!isPasswordValid) {
      throw new ApiError({
        status: 404,
        type: "NOT_FOUND",
        message: userMsg.NOT_FOUND,
      });
    }

    return this.sanitize(user);
  };

  public getUser = async (id: string): Promise<IUser> => {
    const user = await this.user.findById(id);
    if (!user) {
      throw new ApiError({
        status: 401,
        type: "UNAUTHORIZED",
        message: userMsg.UNAUTHORIZED,
      });
    }
    return this.sanitize(user);
  };
}

export default AuthService;

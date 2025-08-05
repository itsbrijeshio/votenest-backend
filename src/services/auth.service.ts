import argon2 from "argon2";
import { Document } from "mongoose";
import { User } from "../models";
import { ApiError } from "../utils";

export interface UserDocument extends Document {
  _id: string;
  password?: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

class AuthService {
  private user = User;

  private sanitize = (user: Document): UserDocument => {
    const { password, polls, __v, ...sanitizedUser } = user?.toJSON?.() || user;
    return sanitizedUser as UserDocument;
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
        message: "Email already exists.",
      });
    }
    return !!user;
  };

  public register = async (data: RegisterPayload): Promise<UserDocument> => {
    await this.isEmailUnique(data.email);
    data.password = await this.hashPassword(data.password);
    const user = await this.user.create(data);
    return this.sanitize(user);
  };

  public login = async (data: LoginPayload): Promise<UserDocument> => {
    const user = await this.user.findOne({ email: data.email });
    if (!user) {
      throw new ApiError({
        status: 400,
        type: "BAD_REQUEST",
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await this.verifyPassword(
      user.password,
      data.password
    );
    if (!isPasswordValid) {
      throw new ApiError({
        status: 400,
        type: "BAD_REQUEST",
        message: "Invalid credentials",
      });
    }

    return this.sanitize(user);
  };

  public getUser = async (id: string): Promise<UserDocument> => {
    const user = await this.user.findById(id);
    if (!user) {
      throw new ApiError({
        status: 401,
        type: "UNAUTHORIZED",
        message: "Authentication failed",
      });
    }
    return this.sanitize(user);
  };
}

export default AuthService;

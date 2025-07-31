import argon2 from "argon2";
import prisma from "../config/prisma";
import { LoginType, RegisterType, UserRes } from "../types";
import { ApiError } from "../utils";

class AuthService {
  private prisma = prisma;

  private sanitize = (user: any): UserRes => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  };

  private hashPassword = async (password: string): Promise<string> => {
    return await argon2.hash(password);
  };

  private verifyPassword = async (
    hashedPass: string,
    password: string
  ): Promise<boolean> => {
    return await argon2.verify(hashedPass, password);
  };

  private isUniqueEmail = async (email: string): Promise<boolean> => {
    const isUser = await this.prisma.user.findUnique({ where: { email } });
    if (isUser) {
      throw new ApiError({
        type: "CONFLICT",
        status: 409,
        message: "Email already exists",
      });
    }
    return !!isUser;
  };

  public register = async (data: RegisterType): Promise<UserRes> => {
    await this.isUniqueEmail(data.email);

    data.password = await this.hashPassword(data.password);
    const newUser = await this.prisma.user.create({ data: data });
    return this.sanitize(newUser);
  };

  public login = async (data: LoginType): Promise<UserRes> => {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: "Invalid Credentials",
      });
    }

    const isVerifyPassword = await this.verifyPassword(
      user?.password as string,
      data.password
    );
    if (!isVerifyPassword) {
      throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: "Invalid Credentials",
      });
    }

    return this.sanitize(user);
  };

  public getMe = async (id: string): Promise<UserRes> => {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
       throw new ApiError({
        type: "NOT_FOUND",
        status: 404,
        message: "Invalid Credentials",
      });
    }

    return this.sanitize(user);
  };
}

export default AuthService;

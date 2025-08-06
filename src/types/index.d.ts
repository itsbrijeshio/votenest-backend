import { Document, ObjectId } from "mongoose";

// ================ Error Type ================
export type ErrorType =
  | "VALIDATION"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "VALIDATION"
  | "INTERNAL_SERVER_ERROR";

// ================ Error Code ================
export type ErrorCode = 400 | 401 | 403 | 404 | 409 | 500 | 501 | 503;

// ================ Error Options ================
export interface ErrorOptions {
  success?: boolean;
  status: ErrorCode;
  type: ErrorType;
  message: string;
}

export interface ErrorInput<T> {
  type: ErrorType;
  message?: string;
  details?: T;
}

// ================ Auth Request ================
declare module "express-serve-static-core" {
  interface Request {
    auth: { _id: string };
  }
}

// =============== User =================
export interface IUser {
  _id: string;
  name: string;
  email: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// =============== Option ================
export interface IOption {
  _id: ObjectId;
  text: string;
  poll: ObjectId;
  votes: number;
}

// =============== Poll ================
export interface IPoll {
  _id: ObjectId;
  user?: string;
  question: string;
  options: string[] | IOption[];
  description?: string;
  expiresAt?: Date;
  votes: number;
}

export interface PollInput {
  question: string;
  description: string;
  options: string[];
}

// =============== Vote ================
export interface IVote {
  _id: ObjectId;
  option: string;
  poll: string;
  user?: string;
  ipAddress?: string;
}

export interface VoteIdentity {
  user?: string;
  ipAddress?: string;
}

// ================ Error Type ================
export type ErrorType =
  | "VALIDATION"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "VALIDATION"
  | "INTERNAL_SERVER";

// ================ Error Code ================
export type ErrorCode = 400 | 401 | 403 | 404 | 409 | 500 | 501 | 503;

// ================ Error Options ================
export interface ErrorOptions {
  success?: boolean;
  status: ErrorCode;
  type: ErrorType;
  message: string;
}

// ================ Auth Request ================
declare module "express-serve-static-core" {
  interface Request {
    auth: { id: string };
  }
}

// ============== Input Types ================

export type RegisterType = {
  name: string;
  email: string;
  password: string;
};

export type LoginType = {
  email: string;
  password: string;
};

// =============== Output Types ================
export type UserRes = {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

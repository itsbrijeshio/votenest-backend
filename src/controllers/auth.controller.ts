import { Request, Response } from "express";
import { AuthService } from "../services";
import { apiResponse, signCookie } from "../utils";

class AuthController extends AuthService {
  constructor() {
    super();
  }

  handleRegister = async (req: Request, res: Response): Promise<void> => {
    const user = await this.register(req.body);
    apiResponse(res, 201, user);
  };

  handleLogin = async (req: Request, res: Response): Promise<void> => {
    const user = await this.login(req.body);
    const token = signCookie(res, user?._id);
    apiResponse(res, 200, null, { token });
  };

  handleLogout = (req: Request, res: Response) => {
    res.clearCookie("token");
    apiResponse(res, 200);
  };

  handleGetUser = async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.auth;
    const user = await this.getUser(_id);
    apiResponse(res, 200, user);
  };
}

export default AuthController;

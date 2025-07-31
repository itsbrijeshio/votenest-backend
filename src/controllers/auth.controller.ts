import { Request, Response } from "express";
import { AuthService } from "../service";
import { response, signCookie } from "../utils";

class AuthController extends AuthService {
  constructor() {
    super();
  }

  handleRegister = async (req: Request, res: Response) => {
    await this.register(req.body);
    response(res, 201, { message: "Registered successfully" });
  };

  handleLogin = async (req: Request, res: Response) => {
    const user = await this.login(req.body);
    const token = signCookie(res, user.id);
    response(res, 200, { message: "Logged in successfully" }, { token });
  };

  handleLogout = async (req: Request, res: Response) => {
    res.clearCookie("access_token");
    response(res, 200, { message: "Logged out successfully" });
  };

  handleGetMe = async (req: Request, res: Response) => {
    const user = await this.getMe(req.auth.id);
    response(res, 200, user);
  };
}

export default AuthController;

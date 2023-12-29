import { Router, Request, Response } from "express"
import { authMiddleware } from "../../infra/http/middlewares/auth.middleware";
import AuthController from "./controller";


const AuthRouter = Router();

const authController = new AuthController();

AuthRouter.post('/login', (req: Request, res: Response) => {
    return authController.login(req, res)
})



export default AuthRouter;
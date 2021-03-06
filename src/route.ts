import { Router } from "express";
import { SessionController } from "./controllers/SessionController";
import { UserController } from "./controllers/UserController";
import { Auth } from "./middlewares/auth";

const router = Router();
const userController = new UserController();
const sessionController = new SessionController();
const authMiddleware = new Auth();

router.post("/user", userController.create);
router.get("/user");
router.get("/user/:id");
router.put("/user/:id");

router.post("/signin", sessionController.singIn);
router.use(authMiddleware.verifyToken);
router.delete("/user/:id");

export { router };

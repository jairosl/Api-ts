import { Router } from "express";
import { AddressController } from "./controllers/AddressController";
import { SessionController } from "./controllers/SessionController";
import { UserController } from "./controllers/UserController";
import { Auth } from "./middlewares/auth";

const router = Router();
const userController = new UserController();
const sessionController = new SessionController();
const addressController = new AddressController();
const authMiddleware = new Auth();

router.post("/user", userController.create);
router.get("/user/:id", userController.show);
router.put("/user/:id", userController.update);
router.delete("/user/:id", userController.delete);

router.post("/signin", sessionController.singIn);

router.post("/address", authMiddleware.verifyToken, addressController.create);
router.get("/address/:id", authMiddleware.verifyToken, addressController.show);
router.put("/address/:id", authMiddleware.verifyToken, addressController.update);
router.delete("/address/:id", authMiddleware.verifyToken, addressController.delete);

export { router };

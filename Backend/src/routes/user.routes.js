import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", registerUser);
router.route("/login").post(loginUser);

router.get("/profile", verifyJWT, getCurrentUser)
router.post("/logout", verifyJWT, logoutUser)
router.patch("/update-profile", verifyJWT, updateAccountDetails);

router.post("/refresh-token",refreshAccessToken)

export default router;
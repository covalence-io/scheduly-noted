import express from "express";
import mw from "../../middlewares/auth.mw";
import controllers from "../../controllers";

const router = express.Router();

router.post("/login", mw.login);
router.post("/register", mw.register);
router.put("/mfa", controllers.users.change_mfa);
router.get("/verify", controllers.users.verify);

export default router;

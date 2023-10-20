import express from "express";
import authRouter from "./auth";
import apiRouter from './api';
import mw from "../middlewares/auth.mw";

const router = express.Router();

router.use("/auth", authRouter);
router.use('/api', mw.token_check, apiRouter);

export default router;

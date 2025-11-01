import { Router } from "express";
import authRoute from "./auth.route";

const router = Router();

router.use("/health", async (req, res) => {
    res.status(200).json({ message: "OK" });
});

router.use("/auth", authRoute);

export default router;
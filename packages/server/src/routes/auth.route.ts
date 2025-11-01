import { authMiddleware } from "../auth";
import { LoginDto, loginDto } from "../dto";
import { BadRequestError, reqWrapper } from "../error";
import { authService } from "../services";
import { Router } from "express";

const router = Router();

router.post("/login", reqWrapper(async (req, res, next) => {
    const validated = loginDto.safeParse(req.body);
    if (!validated.success) {
        throw new BadRequestError(validated.error.message);
    }

    const validatedData: LoginDto = validated.data;
    const token = await authService.login(validatedData);

    res.status(200).json({ token });
}));

router.get("/me", authMiddleware, reqWrapper(async (req, res, next) => {
    res.status(200).json({ userId: req.token.userId });
}));

export default router;
import { Router } from "express";
import { createbmi, getBmi } from "../controllers/bmi.controller.js";
import { authenticate } from "../middlewares/user.middleware.js";

const router = Router();

router.post("/create", [authenticate], createbmi);
router.get("/history", [authenticate], getBmi);

export default router;

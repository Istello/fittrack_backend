import { Router } from "express";
import {
  createbmi,
  getBmi,
} from "../controllers/user.controller.js";
import { adminsOnly, authenticate } from "../middlewares/user.middleware.js";

const router = Router();

router.post("/create",[autgenticate], createbmi);
router.post("/history",[authenticate], getBmi);

export default router;

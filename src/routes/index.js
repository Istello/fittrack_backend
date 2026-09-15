import { Router } from "express";
import userRouter from "./user.routes.js";
import bmiRouter from "./bmi.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to my API" });
});

router.use("/users", userRouter);
router.use("/bmi", bmiRouter);

export default router;

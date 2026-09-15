import Bmi from "../models/bmi.model.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export async function createbmi(req, res) {
  const body = req.body;
  const cookie = req.cookies;
  if (!body) {
    return res.status(400).json({ detail: "Request body is required" });
  }

  const { weight, height } = body;
  const rmheight = height/100;
  const mheight = rmheight * rmheight;
  const bmi = weight / mheight;
  try {
    const decodedUser = jwt.verify(token, env.JWT_ACCESS);
    const userId = decodedUser.userId;

    const bmi = await Bmi.create({
      userId,
      height,
      weight,
      bmi
    });

    res.json({ BMI: `${bmi}` });
  } catch (e) {
    console.log(e);
    res.status(500).send({ detail: "Something went wrong!!" });
  }
}

export async function getBmi(req, res) {
  try {
    const bmis = await Bmi.find({
        userId:
    });
    return res.json({ bmis });
  } catch (e) {
    return res.status(500).json({ detail: "Something went wrong!" });
  }
}


//export async function getProfile(req, res) {
//  res.json(req.bmi);
//}
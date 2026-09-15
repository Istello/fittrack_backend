import Bmi from "../models/bmi.model.js";

export async function createbmi(req, res) {
  const body = req.body;
  if (!body) {
    return res.status(400).json({ detail: "Request body is required" });
  }

  const { weight, height } = body;
  if (!weight || !height) {
    return res.status(400).json({ detail: "Height and weight are required" });
  }

  const rmheight = height / 100;
  const mheight = rmheight * rmheight;
  const calculatedBmi = weight / mheight;

  try {
    const bmiRecord = await Bmi.create({
      userId: req.user._id,
      height,
      weight,
      bmi: calculatedBmi,
    });

    return res.status(201).json({ bmi: bmiRecord });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ detail: "Something went wrong!!" });
  }
}

export async function getBmi(req, res) {
  try {
    const bmis = await Bmi.find({
      userId: req.user._id,
    });
    return res.json({ bmis });
  } catch (e) {
    return res.status(500).json({ detail: "Something went wrong!" });
  }
}

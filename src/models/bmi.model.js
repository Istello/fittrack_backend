const bmiSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    bmi: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model("Bmi", bmiSchema)

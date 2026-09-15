import app from "./app.js";
import connectDb from "./config/db.js";
import env from "./config/env.js";

const PORT = env.PORT || 3000;

async function start() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
  });
}

start();

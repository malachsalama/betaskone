const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose schema
const userSchema = new mongoose.Schema({
  slack_name: String,
  current_day: String,
  utc_time: Date,
  track: String,
  github_file_url: String,
  github_repo_url: String,
  status_code: Number,
});

// Mongoose model
const User = mongoose.model("User", userSchema);

// API endpoint
app.get("/api", async (req, res) => {
  try {
    // Check if both query parameters are provided
    if (!req.query.slack_name || !req.query.track) {
      res
        .status(400)
        .json({ error: "Both slack_name and track are required." });
      return;
    }

    const slackName = req.query.slack_name;
    const track = req.query.track;

    console.log(slackName, track);

    // Get the current UTC time and day of the week
    const todayInUTC = new Date().toISOString();
    const todayDayOfWeek = new Date().toLocaleString("en-US", {
      weekday: "long",
    });

    // Update the MongoDB collection
    const query = User.find(
      { slack_name: slackName, track: track }
      // { $set: { utc_time: todayInUTC, current_day: todayDayOfWeek } },
      // { returnOriginal: false },
      // {
      //   timeout: 30000,
      //   new: true,
      // }
    );
    const result = await query.exec();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error on beta 9" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Pin = require("./models/Pin");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// New schema for frontend two fields
const dataSchema = new mongoose.Schema({
  field1: String,
  field2: String,
}, { timestamps: true });
const Data = mongoose.model('Data', dataSchema);


// New /data routes for frontend
app.post('/data', async (req, res) => {
  const { field1, field2 } = req.body;

  if (!field1 || !field2) {
    return res.status(400).json({ status: "error", message: "Both fields are required" });
  }

  try {
    const newData = new Data({ field1, field2 });
    await newData.save();
    res.json({ status: "success", data: newData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Get the latest data
app.get('/data', async (req, res) => {
  try {
    const latestData = await Data.findOne().sort({ createdAt: -1 }); // sort by newest
    if (!latestData) {
      return res.json({ message: "No data found" });
    }
    res.json(latestData);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});



// --- Create or Set PIN (only once) ---
app.post("/set-pin", async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin || pin.length !== 5) {
      return res.status(400).json({ error: "PIN must be exactly 5 digits" });
    }

    // check if PIN already exists
    const existing = await Pin.findOne();
    if (existing) {
      return res
        .status(400)
        .json({ error: "PIN already set. Use /update-pin to change it." });
    }

    const newPin = new Pin({ pin });
    await newPin.save();
    res.json({ message: "PIN set successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Update PIN ---
app.put("/update-pin", async (req, res) => {
  try {
    const { oldPin, newPin } = req.body;

    if (!newPin || newPin.length !== 5) {
      return res.status(400).json({ error: "New PIN must be exactly 5 digits" });
    }

    const pinDoc = await Pin.findOne();
    if (!pinDoc) {
      return res.status(404).json({ error: "No PIN set yet" });
    }

    if (pinDoc.pin !== oldPin) {
      return res.status(403).json({ error: "Old PIN is incorrect" });
    }

    pinDoc.pin = newPin;
    await pinDoc.save();
    res.json({ message: "PIN updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Get Current PIN (optional, for debugging) ---
app.get("/get-pin", async (req, res) => {
  try {
    const pinDoc = await Pin.findOne();
    if (!pinDoc) return res.status(404).json({ error: "No PIN set" });
    res.json({ pin: pinDoc.pin });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

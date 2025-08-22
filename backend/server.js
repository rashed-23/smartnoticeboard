const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

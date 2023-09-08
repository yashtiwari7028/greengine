const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors middleware
const PhValue = require("./schema/phvalues");
const DailyAverage = require("./schema/dailyAverages");

const app = express();
const port = 3000;


mongoose
  .connect("mongodb://127.0.0.1:27017/greengine", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


app.use(cors());

app.use(express.json());

// Store a pH value
app.post("/store-phvalue", async (req, res) => {
  try {
    const { plant, date, hour, phValue } = req.body;

    const newValue = new PhValue({ plant, date, hour, phValue });
    await newValue.save();

    res.status(201).json({ message: "pH Value stored successfully", newValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/get-phvalues-perhour/:plant/:date", async (req, res) => {
  try {
    const { plant, date } = req.params;

    
    const pHValues = await PhValue.find({ plant, date });

    console.log("pHValues:", pHValues);

    res.json(pHValues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/calculate-daily-average/:plant/:date", async (req, res) => {
  try {
    const { plant, date } = req.params;

    const dateObject = new Date(date);
    dateObject.setHours(0, 0, 0, 0);

    const endDate = new Date(dateObject);
    endDate.setDate(endDate.getDate() + 1);

    const phValues = await PhValue.find({
      plant,
      date: { $gte: dateObject, $lt: endDate },
    });

    const totalPhValue = phValues.reduce((sum, value) => {
      return sum + value.phValue;
    }, 0);

    const averagePhValue =
      phValues.length > 0 ? totalPhValue / phValues.length : 0;

   
    await DailyAverage.create({ plant, date: dateObject, averagePhValue });

    res.status(201).json({
      message: "Daily average pH Value stored successfully",
      averagePhValue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

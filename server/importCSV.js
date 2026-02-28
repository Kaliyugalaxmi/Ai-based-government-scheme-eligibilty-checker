const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const Scheme = require("./models/Scheme");

mongoose
  .connect("mongodb://127.0.0.1:27017/Hackathon")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const results = [];

fs.createReadStream("../data/government_schemes.csv")
  .pipe(csv())
  .on("data", (data) => {
    results.push({
      schemeId:    data.schemeId    ? Number(data.schemeId)    : null,
      schemeName:  data.schemeName  ? data.schemeName.trim()   : null,
      category:    data.category    || null,
      minAge:      data.minAge      ? Number(data.minAge)      : null,
      maxAge:      data.maxAge      ? Number(data.maxAge)      : null,
      incomeLimit: data.incomeLimit ? Number(data.incomeLimit) : null,
      caste:       data.caste       || "All",
      gender:      data.gender      || "All",
      state:       data.state       || "All",
      benefit:     data.benefit     || null,
    });
  })
  .on("end", async () => {
    try {
      // Filter out any rows where schemeName is missing (required field)
      const validResults = results.filter((r) => r.schemeName);

      if (validResults.length === 0) {
        console.log("No valid records found. Check your CSV column headers.");
        mongoose.connection.close();
        return;
      }

      await Scheme.insertMany(validResults);
      console.log(`✅ ${validResults.length} schemes imported successfully!`);
    } catch (error) {
      console.error("❌ Import failed:", error.message);
    } finally {
      mongoose.connection.close();
    }
  })
  .on("error", (err) => {
    console.error("❌ Error reading CSV file:", err.message);
  });
require("dotenv").config();
const express = require("express");
const connectDB = require("./config");
const routes = require("./routes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 📌 ربط قاعدة البيانات
connectDB();

// 📌 ربط المسارات
app.use("/api", routes);

// 📌 تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 السيرفر شغال على http://localhost:${PORT}`));

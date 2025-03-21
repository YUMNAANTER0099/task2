const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("./models");
require("dotenv").config();

const router = express.Router();

// 🟢 تسجيل مستخدم جديد
router.post("/signup", async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const user = new User({ name, username, password });
    await user.save();
    res.status(201).json({ message: "✅ تم تسجيل المستخدم بنجاح" });
  } catch (error) {
    res.status(400).json({ error: "❌ فشل في التسجيل، اسم المستخدم مستخدم بالفعل" });
  }
});

// 🔑 تسجيل الدخول وإصدار توكن
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "❌ المستخدم غير موجود" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "❌ كلمة المرور غير صحيحة" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "❌ خطأ في تسجيل الدخول" });
  }
});

module.exports = router;
const authenticateToken = require("./middleware");
const { Product } = require("./models");

// 🟢 إضافة منتج جديد
router.post("/products", authenticateToken, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: "❌ فشل في إضافة المنتج" });
  }
});

// 🔍 جلب كل المنتجات
router.get("/products", authenticateToken, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 🔎 جلب منتج واحد بالـ ID
router.get("/products/:pid", authenticateToken, async (req, res) => {
  const product = await Product.findById(req.params.pid);
  if (!product) return res.status(404).json({ error: "❌ المنتج غير موجود" });
  res.json(product);
});

// ✏️ تعديل منتج
router.put("/products/:pid", authenticateToken, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
  if (!product) return res.status(404).json({ error: "❌ المنتج غير موجود" });
  res.json(product);
});

// 🗑️ حذف منتج
router.delete("/products/:pid", authenticateToken, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.pid);
  if (!product) return res.status(404).json({ error: "❌ المنتج غير موجود" });
  res.json({ message: "✅ تم حذف المنتج" });
});

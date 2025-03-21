const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 📌 تصميم جدول المستخدمين
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// 🔐 تشفير الباسورد قبل الحفظ
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 📌 تصميم جدول المنتجات
const ProductSchema = new mongoose.Schema({
  pname: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

// 📌 تصدير النماذج
const User = mongoose.model("User", UserSchema);
const Product = mongoose.model("Product", ProductSchema);

module.exports = { User, Product };

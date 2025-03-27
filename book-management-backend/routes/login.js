const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { client } = require("../config/db"); // Import client từ file config
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
const DB_NAME = "book-management"; // Tên database của bạn
const COLLECTION_NAME = "nhanviens"; // Tên collection nhân viên

// Hàm tạo JWT token
const generateToken = (nhanVien) => {
  return jwt.sign(
    { MSNV: nhanVien.MSNV, ChucVu: nhanVien.ChucVu },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

// Xử lý đăng nhập bằng MSNV
router.post("/", async (req, res) => {
  const { MSNV, Password } = req.body;

  try {
    const db = client.db(DB_NAME);
    const nhanVienCollection = db.collection(COLLECTION_NAME);

    // Tìm nhân viên theo MSNV
    const nhanVien = await nhanVienCollection.findOne({ MSNV });

    if (!nhanVien) {
      return res
        .status(401)
        .json({ message: "Mã số nhân viên không tồn tại!" });
    }

    // So sánh mật khẩu đã mã hóa
    const isPasswordValid = await bcrypt.compare(Password, nhanVien.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mật khẩu không đúng!" });
    }

    // Tạo JWT token
    const token = generateToken(nhanVien);
    res.json({ token, ChucVu: nhanVien.ChucVu, HoTenNV: nhanVien.HoTenNV });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi máy chủ!" });
  }
});

module.exports = router;

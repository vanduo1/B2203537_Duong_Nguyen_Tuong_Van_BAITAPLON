const express = require("express");
const bcrypt = require("bcryptjs"); // Thư viện mã hóa mật khẩu
const { client } = require("../config/db");

const router = express.Router();
const db = client.db("book-management");
const nhanVienCollection = db.collection("nhanviens");

// Lấy danh sách tất cả nhân viên
router.get("/", async (req, res) => {
  try {
    const nhanViens = await nhanVienCollection.find().toArray();
    res.json(nhanViens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy nhân viên theo mã số (MSNV)
router.get("/:msnv", async (req, res) => {
  try {
    const nhanVien = await nhanVienCollection.findOne({
      msnv: req.params.MSNV,
    });
    if (!nhanVien) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    res.json(nhanVien);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm nhân viên mới (Mã hóa mật khẩu trước khi lưu)
router.post("/", async (req, res) => {
  try {
    const newNhanVien = req.body;

    // Kiểm tra xem mã nhân viên đã tồn tại chưa
    const existingNhanVien = await nhanVienCollection.findOne({
      MSNV: newNhanVien.MSNV,
    });
    if (existingNhanVien) {
      return res.status(400).json({ message: "Mã nhân viên đã tồn tại" });
    }

    // Mã hóa mật khẩu trước khi lưu vào DB
    const hashedPassword = await bcrypt.hash(newNhanVien.Password, 10);
    newNhanVien.Password = hashedPassword;

    const result = await nhanVienCollection.insertOne(newNhanVien);
    res.status(201).json({ _id: result.insertedId, ...newNhanVien });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật thông tin nhân viên theo mã số (MSNV)
router.put("/:msnv", async (req, res) => {
  try {
    const updatedNhanVien = req.body;

    // Kiểm tra xem có cập nhật mật khẩu không, nếu có thì mã hóa
    if (updatedNhanVien.Password) {
      updatedNhanVien.Password = await bcrypt.hash(
        updatedNhanVien.Password,
        10
      );
    }

    const result = await nhanVienCollection.updateOne(
      { MSNV: req.params.msnv },
      { $set: updatedNhanVien }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa nhân viên theo mã số (MSNV)
router.delete("/:msnv", async (req, res) => {
  try {
    const result = await nhanVienCollection.deleteOne({
      msnv: req.params.MSNV,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

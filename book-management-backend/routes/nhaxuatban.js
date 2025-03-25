const express = require("express");
const { client } = require("../config/db");

const router = express.Router();
const db = client.db("book-management");
const nhaXuatBanCollection = db.collection("nhaxuatbans");

// Lấy danh sách tất cả nhà xuất bản
router.get("/", async (req, res) => {
  try {
    const nhaXuatBans = await nhaXuatBanCollection.find().toArray();
    res.json(nhaXuatBans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy nhà xuất bản theo mã (maNXB)
router.get("/:maNXB", async (req, res) => {
  try {
    const nhaXuatBan = await nhaXuatBanCollection.findOne({
      maNXB: req.params.maNXB,
    });
    if (!nhaXuatBan) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }
    res.json(nhaXuatBan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm nhà xuất bản mới
router.post("/", async (req, res) => {
  try {
    const newNhaXuatBan = req.body;

    // Kiểm tra xem mã nhà xuất bản đã tồn tại chưa
    const existingNXB = await nhaXuatBanCollection.findOne({
      maNXB: newNhaXuatBan.maNXB,
    });
    if (existingNXB) {
      return res.status(400).json({ message: "Mã nhà xuất bản đã tồn tại" });
    }

    const result = await nhaXuatBanCollection.insertOne(newNhaXuatBan);
    res.status(201).json({ _id: result.insertedId, ...newNhaXuatBan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật thông tin nhà xuất bản theo mã (maNXB)
router.put("/:maNXB", async (req, res) => {
  try {
    const updatedNXB = req.body;
    const result = await nhaXuatBanCollection.updateOne(
      { maNXB: req.params.maNXB },
      { $set: updatedNXB }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa nhà xuất bản theo mã (maNXB)
router.delete("/:maNXB", async (req, res) => {
  try {
    const result = await nhaXuatBanCollection.deleteOne({
      maNXB: req.params.maNXB,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require("express");
const { client } = require("../config/db");

const router = express.Router();
const db = client.db("book-management");
const docGiaCollection = db.collection("docgias");

// Lấy danh sách độc giả
router.get("/", async (req, res) => {
  try {
    const docGias = await docGiaCollection.find().toArray();
    res.json(docGias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm độc giả mới
router.post("/", async (req, res) => {
  try {
    const newDocGia = req.body;
    // console.log("req", req.body);
    const result = await docGiaCollection.insertOne(newDocGia);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy độc giả theo mã (maDocGia)
router.get("/:maDocGia", async (req, res) => {
  try {
    const docGia = await docGiaCollection.findOne({
      MADOCGIA: req.params.maDocGia,
    });
    if (!docGia) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }
    res.json(docGia);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật thông tin độc giả theo mã (maDocGia)
router.put("/:maDocGia", async (req, res) => {
  try {
    const updatedDocGia = req.body;
    const result = await docGiaCollection.updateOne(
      { maDocGia: req.params.MADOCGIA },
      { $set: updatedDocGia }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa độc giả theo mã (maDocGia)
router.delete("/:maDocGia", async (req, res) => {
  try {
    const result = await docGiaCollection.deleteOne({
      maDocGia: req.params.MADOCGIA,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

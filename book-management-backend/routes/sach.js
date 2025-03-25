const express = require("express");
const { client } = require("../config/db");

const router = express.Router();
const db = client.db("book-management");
const sachCollection = db.collection("saches");

// Lấy danh sách sách
router.get("/", async (req, res) => {
  try {
    const books = await sachCollection.find().toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm sách mới
router.post("/", async (req, res) => {
  try {
    const newBook = req.body;
    const result = await sachCollection.insertOne(newBook);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy sách theo mã sách (maSach)
router.get("/:maSach", async (req, res) => {
  try {
    const book = await sachCollection.findOne({ maSach: req.params.maSach });
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật thông tin sách theo mã sách (maSach)
router.put("/:maSach", async (req, res) => {
  try {
    const updatedBook = req.body;
    const result = await sachCollection.updateOne(
      { maSach: req.params.maSach },
      { $set: updatedBook }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa sách theo mã sách (maSach)
router.delete("/:maSach", async (req, res) => {
  try {
    const result = await sachCollection.deleteOne({
      maSach: req.params.maSach,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

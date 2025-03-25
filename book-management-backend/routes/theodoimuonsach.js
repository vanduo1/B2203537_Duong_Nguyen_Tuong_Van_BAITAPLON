const express = require("express");
const { client } = require("../config/db");

const router = express.Router();
const db = client.db("book-management");
const muonSachCollection = db.collection("theodoimuonsachs");

// Lấy danh sách tất cả giao dịch mượn sách
router.get("/", async (req, res) => {
  try {
    const muonSachs = await muonSachCollection.find().toArray();
    res.json(muonSachs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy danh sách mượn sách theo mã độc giả (MADOCGIA)
router.get("/:MADOCGIA", async (req, res) => {
  try {
    const muonSach = await muonSachCollection
      .find({ MADOCGIA: req.params.MADOCGIA })
      .toArray();
    if (muonSach.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch sử mượn sách của độc giả" });
    }
    res.json(muonSach);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm giao dịch mượn sách mới
router.post("/", async (req, res) => {
  try {
    const { MADOCGIA, MASACH, NGAYMUON, NGAYTRA } = req.body;

    // Kiểm tra xem độc giả và sách có tồn tại không (có thể thêm kiểm tra nếu cần)
    const newMuonSach = { MADOCGIA, MASACH, NGAYMUON, NGAYTRA };
    const result = await muonSachCollection.insertOne(newMuonSach);
    res.status(201).json({ _id: result.insertedId, ...newMuonSach });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật ngày trả sách theo mã độc giả & mã sách
router.put("/:MADOCGIA/:MASACH", async (req, res) => {
  try {
    const { NGAYTRA } = req.body;
    const result = await muonSachCollection.updateOne(
      { MADOCGIA: req.params.MADOCGIA, MASACH: req.params.MASACH },
      { $set: { NGAYTRA } }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giao dịch mượn sách" });
    }
    res.json({ message: "Cập nhật ngày trả sách thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa giao dịch mượn sách theo mã độc giả & mã sách
router.delete("/:MADOCGIA/:MASACH", async (req, res) => {
  try {
    const result = await muonSachCollection.deleteOne({
      MADOCGIA: req.params.MADOCGIA,
      MASACH: req.params.MASACH,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giao dịch mượn sách" });
    }
    res.json({ message: "Xóa giao dịch thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

const express = require("express");
const { client } = require("../config/db");

const router = express.Router();
const db = client.db("book-management");
const muonSachCollection = db.collection("theodoimuonsachs");
const sachCollection = db.collection("saches");

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

    // 1️⃣ Kiểm tra xem sách có tồn tại không
    const sach = await sachCollection.findOne({ MASACH });
    if (!sach) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    // 2️⃣ Kiểm tra số lượng sách còn lại
    if (sach.SOQUYEN <= 0) {
      return res.status(400).json({ message: "Sách đã hết, không thể mượn" });
    }

    // 3️⃣ Thêm lượt mượn vào collection `theodoimuonsachs`
    const newMuonSach = { MADOCGIA, MASACH, NGAYMUON, NGAYTRA };
    await muonSachCollection.insertOne(newMuonSach);

    // 4️⃣ Giảm số lượng sách đi 1
    await sachCollection.updateOne({ MASACH }, { $inc: { SOQUYEN: -1 } });

    res.status(201).json({ message: "Mượn sách thành công", ...newMuonSach });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật ngày trả sách theo mã độc giả & mã sách

router.put("/:MADOCGIA/:MASACH/:NGAYMUON", async (req, res) => {
  try {
    const { NGAYTRA } = req.body;
    const { MADOCGIA, MASACH, NGAYMUON } = req.params;

    // Tìm giao dịch mượn sách cụ thể
    const muonSach = await muonSachCollection.findOne({
      MADOCGIA,
      MASACH,
      NGAYMUON,
    });

    if (!muonSach) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giao dịch mượn sách" });
    }

    // Nếu sách chưa được trả (NGAYTRA hiện tại là null hoặc rỗng)
    if (!muonSach.NGAYTRA) {
      await sachCollection.updateOne(
        { MASACH: MASACH },
        { $inc: { SOQUYEN: 1 } }
      );
    }

    // Cập nhật ngày trả sách
    const result = await muonSachCollection.updateOne(
      { MADOCGIA, MASACH, NGAYMUON },
      { $set: { NGAYTRA } }
    );

    if (result.modifiedCount === 0) {
      return res.json({ message: "Không có thay đổi nào được thực hiện" });
    }

    res.json({ message: "Cập nhật ngày trả sách thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
});

router.delete("/:MADOCGIA/:MASACH/:NGAYMUON", async (req, res) => {
  try {
    const { MADOCGIA, MASACH, NGAYMUON } = req.params;

    // Kiểm tra xem giao dịch có tồn tại không
    const muonSach = await muonSachCollection.findOne({
      MADOCGIA,
      MASACH,
      NGAYMUON,
    });
    if (!muonSach) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giao dịch mượn sách" });
    }

    // Xóa giao dịch mượn sách
    const result = await muonSachCollection.deleteOne({
      MADOCGIA,
      MASACH,
      NGAYMUON,
    });
    if (result.deletedCount === 0) {
      return res.status(500).json({ message: "Lỗi khi xóa giao dịch" });
    }

    // Nếu sách chưa được trả thì tăng số lượng sách lên 1
    if (!muonSach.NGAYTRA) {
      await sachCollection.updateOne({ MASACH }, { $inc: { SOQUYEN: 1 } });
      return res.json({
        message: "Xóa giao dịch thành công, số lượng sách đã cập nhật",
      });
    }

    res.json({
      message:
        "Xóa giao dịch thành công (Lượt mượn đã trả, không cập nhật số sách)",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

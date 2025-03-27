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

router.delete("/:MADOCGIA/:MASACH", async (req, res) => {
  try {
    const { MADOCGIA, MASACH } = req.params;

    // 1️⃣ Kiểm tra xem giao dịch có tồn tại không
    const muonSach = await muonSachCollection.findOne({ MADOCGIA, MASACH });
    if (!muonSach) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giao dịch mượn sách" });
    }

    // 2️⃣ Xóa giao dịch mượn sách
    const result = await muonSachCollection.deleteOne({ MADOCGIA, MASACH });
    if (result.deletedCount === 0) {
      return res.status(500).json({ message: "Lỗi khi xóa giao dịch" });
    }

    // 3️⃣ Kiểm tra nếu sách chưa được trả hoặc còn trong hạn mượn => Cập nhật số quyển
    const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại (YYYY-MM-DD)

    if (!muonSach.NGAYTRA || muonSach.NGAYTRA >= today) {
      await sachCollection.updateOne({ MASACH }, { $inc: { SOQUYEN: 1 } });
      return res.json({
        message: "Xóa giao dịch thành công, số lượng sách đã cập nhật",
      });
    }

    res.json({
      message:
        "Xóa giao dịch thành công (Lượt mượn cũ, không cập nhật số sách)",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy ngày trả gần nhất của một mã sách
router.get("/next-return/:MASACH", async (req, res) => {
  try {
    const { MASACH } = req.params;

    // Tìm bản ghi có NGAYTRA gần nhất (lớn hơn ngày hiện tại)
    const today = new Date().toISOString().split("T")[0]; // Ngày hiện tại (YYYY-MM-DD)

    const nextReturn = await muonSachCollection
      .find({ MASACH, NGAYTRA: { $gte: today } }) // Chỉ lấy những bản ghi có ngày trả >= hôm nay
      .sort({ NGAYTRA: 1 }) // Sắp xếp theo ngày trả tăng dần
      .limit(1) // Lấy bản ghi sớm nhất
      .toArray();

    if (nextReturn.length === 0) {
      return res.json({ message: "Chưa có lịch trả sách sắp tới" });
    }

    res.json({ nextReturnDate: nextReturn[0].NGAYTRA });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

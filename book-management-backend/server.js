const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối DB
connectDB();

// Routes
app.use("/api/sach", require("./routes/sach"));
app.use("/api/docgia", require("./routes/docgia"));
app.use("/api/nhaxuatban", require("./routes/nhaxuatban"));
app.use("/api/theodoimuonsach", require("./routes/theodoimuonsach"));
app.use("/api/nhanvien", require("./routes/nhanvien"));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

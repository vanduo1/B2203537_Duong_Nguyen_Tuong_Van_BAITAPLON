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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

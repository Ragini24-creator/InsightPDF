
const express = require("express");
const multer = require("multer");
const { uploadPDF } = require("../controllers/pdfController");
const cors = require('cors')

const router = express.Router();
const upload = multer({ dest: "uploads/" }); 

router.post("/upload-pdf", upload.single("pdf"), uploadPDF);

module.exports = router;

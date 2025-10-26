const { extractTextFromPDF } = require("../services/pdfParser");
const { chunkText ,truncateByWords} = require("../utils/helperMethods"); 
const { insertDocs } = require("../services/insertDocs");
const fs = require("fs");
const path = require("path");

const uploadPDF = async (req, res) => {
  try {
    console.log("Inside uploadPdf")
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    const pages = await extractTextFromPDF (fileBuffer);

    // Create chunks for all pages
    const allChunks = [];
    pages.forEach((page) => {
      const pageChunks = chunkText(page.content, 500); 
      pageChunks.forEach((chunkContent, index) => {
        allChunks.push({
          pageNumber: page.pageNumber,
          chunkIndex: index + 1,
          content: chunkContent,
          title: `Page ${page.pageNumber} - Chunk ${index + 1}`,
        });
      });
    });

    await insertDocs("queryPDF", allChunks);

  
    //Delete uploaded files
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", err);
    });

    res.json({
      message: "PDF parsed successfully",
      totalPages: pages.length,
      sample: pages.slice(0, 2),
    });
  } catch (err) {
    console.error("Error parsing PDF:", err);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
};


module.exports = { uploadPDF };



const pdfParse = require("pdf-parse");



const extractTextFromPDF = async function (pdfBuffer) {
  const data = await pdfParse(pdfBuffer);

  const totalPages = data.numpages || 1;
  let text = data.text.trim();

  let pages = text.split("\f").filter(Boolean);

  if (pages.length < totalPages) {
    const approxCharsPerPage = Math.ceil(text.length / totalPages);
    pages = Array.from({ length: totalPages }, (_, i) =>
      text.slice(i * approxCharsPerPage, (i + 1) * approxCharsPerPage).trim()
    );
  }

  return pages.map((content, index) => ({
    pageNumber: index + 1,
    content,
  }));
}

module.exports = { extractTextFromPDF };

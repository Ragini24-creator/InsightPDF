

/**
 * Chunks a string into smaller pieces by words
 * 
 * @param {string} text 
 * @param {number} chunkSize Number of words per chunk
 * 
 * @returns {Array<string>}
 */
function chunkText(text, chunkSize = 500) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}

/**
 * Converts parsed pages into chunked documents with page numbers
 * 
 * @param {Array<{pageNumber: number, content: string}>} pages
 * @param {number} chunkSize Number of words per chunk
 * 
 * @returns {Array<{pageNumber: number, content: string, chunkIndex: number}>}
 */
function chunkPages(pages, chunkSize = 500) {
  const allChunks = [];
  for (const page of pages) {
    const pageChunks = chunkText(page.content, chunkSize);
    pageChunks.forEach((chunk, idx) => {
      allChunks.push({
        pageNumber: page.pageNumber,
        chunkIndex: idx + 1, 
        content: chunk
      });
    });
  }
  return allChunks;
}


/**
 * truncateByWords
 * 
 * Truncate text to a maximum number of words
 * 
 * @param {string} text - Original text
 * @param {number} maxWords - Maximum allowed words
 * 
 * @returns {string} - Truncated text
 */
function truncateByWords(text, maxWords = 6000) {
    const words = text.split(/\s+/);  // split by spaces
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ");
}

/**
 * extractCitations
 * 
 * @param {*} citations
 *  
 * @returns {Array} Page Numbers for citation
 */
const extractCitations = (citations) => {
  let pageNumbers = []

  citations.forEach((obj) => {
    if (!pageNumbers.includes(obj.page)) {
      pageNumbers.push(obj.page)
    }
  })

  return pageNumbers;
}

/**
 * cleanAIText
 * 
 * @param {*} text 
 * 
 * @returns {string} cleaned text
 */
const cleanAIText = function (text) {
  if (!text) return "";

  return text
    .replace(/(\*\*|\*|__)/g, "")
    .replace(/\n{2,}/g, "\n")
    .split("\n")
    .map(line => line.trim())
    .join("\n")
    .replace(/\s{2,}/g, " ");
}

module.exports = { extractCitations, chunkText, chunkPages , truncateByWords, cleanAIText};

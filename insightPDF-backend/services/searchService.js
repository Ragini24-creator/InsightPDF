const { getQdrantClient } = require("../datastore/qdrantConnection.js");
const { getEmbeddings } = require("./embeddingService.js");



/**
 * searchDocs
 * 
 * Searches Qdrant collection using Jina embeddings for the query
 * 
 * @param {string} query - User query
 * @param {number} k - Number of top results to retrieve
 * 
 * @returns {Array} - Array of payloads with {title, content, url}
 */
async function searchDocs(query, k = 10) {
    const client = getQdrantClient();
    const embedding = await getEmbeddings(query);

    if (!embedding) {
        console.error("Failed to generate embedding for query");
        return [];
    }

    const results = await client.search("queryPDF", {
        vector: embedding,
        limit: k,
    });

    // Only return payloads that have content
    return results
  .map(r => ({
    title: r.payload.title,
    content: r.payload.content,
    url: r.payload.url,
    pageNumber: r.payload.pageNumber,  
    chunkIndex: r.payload.chunkIndex,   
  }))
  .filter(p => p && p.content);
}

module.exports = { searchDocs };

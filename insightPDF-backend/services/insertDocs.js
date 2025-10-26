const fs = require("fs");
const { getEmbeddings } = require("./embeddingService");
const uuid = require("uuid");
const { getQdrantClient } = require("../datastore/qdrantConnection");
const { truncateByWords } = require("../utils/helperMethods")



/**
 * Inserts chunked documents into Qdrant with Jina embeddings
 * 
 * @param {string} collectionName - Qdrant collection name
 * @param {Array<{pageNumber: number, chunkIndex: number, content: string, title?: string}>} chunks
 */
async function insertDocs(collectionName, chunks) {
    const client = getQdrantClient();
    const vectors = [];

    for (const chunk of chunks) {
        const truncatedContent = truncateByWords(chunk.content, 6000);
        const cleanContent = truncatedContent.replace(/<[^>]+>/g, '');
        const embedding = await getEmbeddings(cleanContent);

        if (!embedding) {
            console.error(`Skipping chunk due to embedding failure: Page ${chunk.pageNumber}`);
            continue;
        }

        vectors.push({
            id: uuid.v4(),
            vector: embedding,
            payload: {
                title: chunk.title || `Page ${chunk.pageNumber} - Chunk ${chunk.chunkIndex}`,
                content: truncatedContent,
                pageNumber: chunk.pageNumber,
                chunkIndex: chunk.chunkIndex
            },
        });
    }

    if (vectors.length === 0) {
        console.log("No valid embeddings to insert.");
        return;
    }

    await client.upsert(collectionName, {
        points: vectors,
    });

    console.log(`Inserted ${vectors.length} chunks into ${collectionName}`);
}

module.exports = { insertDocs };





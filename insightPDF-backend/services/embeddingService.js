const axios = require("axios");

// const JINA_API_URL = "https://api.jina.ai/v1/embeddings";

const getEmbeddings = async function (text) {

    try {
        const response = await axios.post(process.env.JINA_API_URL, {
            model: "jina-embeddings-v3",
            task: "text-matching",
            input: [text],
        },

            {
                headers: {
                    "Authorization": `Bearer ${process.env.JINA_API_KEY}`,
                    "Content-Type": "application/json"
                }

            }
        );
        
        return response.data.data[0].embedding
    } catch (err) {
        console.error("Error while fetching embedding", err)
        return null;
    }

}

module.exports = { getEmbeddings }
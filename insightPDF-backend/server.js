const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()

const { initializeQdrantClient,setupCollection } = require('./datastore/qdrantConnection');
const routes = require('./routes/chatRoutes.js')
const { initializeRedisClient } = require('./datastore/redisClient.js')
const pdfRoute = require("./routes/pdfRoute.js");

const app = express()

app.use(cors())

app.use(express.json())


app.use("/api", routes)
app.use("/api", pdfRoute);


app.use((err, req, res, next) => {
  console.error(err.stack); // logs the error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});


// Start server
const PORT = 8002;
app.listen(PORT,  async() => {
    try {
        initializeQdrantClient();
        await initializeRedisClient()
        
        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        console.error(`Error occurred while starting Rag News Chatbot App :: ${JSON.stringify(err)}`)
        console.log(err)
    }
});
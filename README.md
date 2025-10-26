# InsightPDF

InsightPDF is a web-based application that allows users to upload PDF documents and interact with their content through a smart chat interface. Using AI-powered embeddings and search, users can ask questions related to the PDF and get precise answers with citations.

---

## Table Of Contents

- [Features](#features)  
- [Token Efficiency and Chunking](#token-efficiency-and-chunking)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation-and-setup)  

---

## Features

- **PDF Upload:** Upload PDF files and analyze their content.
- **AI Chat Interface:** Ask questions about the PDF content and get concise answers.
- **Citations:** Answers include citations with page references from the PDF.
- **Responsive UI:** The interface is split into two panels: chat & PDF viewer.
- **Efficient Processing:** Extracts relevant information and minimizes token usage.
- **Cache & Sessions:** Redis (in-memory) – Stores session history per user. Fast read/write, supports TTL, and handles multiple sessions efficiently.

---

### Token Efficiency and Chunking

To minimize token usage and improve performance, the PDF text is split into smaller chunks of approximately 500 words per page. Each chunk is stored with its page number and index, allowing the system to:

- Generate embeddings only for manageable text blocks.
- Retrieve relevant chunks for a user query instead of sending entire pages.
- Reduce API costs and improve response speed while keeping context accurate.

This chunking strategy ensures efficient use of tokens during both embedding and question-answering.


## Tech Stack

**Frontend:** React, react-pdf  
**Backend:** Node.js, Express, Multer (for PDF uploads)  
**Database / Vector Store:** Qdrant for embeddings  
**AI / NLP:** Jina embeddings, Google Gemini AI  
**Caching:** Redis  
**PDF Parsing:** pdf-parse

---

## Installation and Setup

1. **Clone the repository**

```bash
git clone https://github.com/Ragini24-creator/InsightPDF.git
cd InsightPDF
```

2. **Install dependencies**

# Backend

```bash
cd insightPDF-backend
npm install
```

# Frontend

```bash
cd insightPDF-frontend
npm install
```

3. **Set environment variables**

### Backend (`insightPDF-backend/.env`)

The backend requires the following environment variables. Create a `.env` file in the `backend` folder and set these keys:

| Variable Name       | Description                                  |
|--------------------|-----------------------------------------------|
| `QDRANT_URL`        | URL of your Qdrant vector database           |
| `QDRANT_API_KEY`    | API key for your Qdrant instance             |
| `JINA_API_URL`      | URL for Jina embeddings API                  |
| `JINA_API_KEY`      | API key for Jina embeddings service          |
| `GEMINI_API_KEY`    | API key for Google Gemini AI service         |
| `REDIS_HOST`        | Hostname of your Redis cloud instance        |
| `REDIS_PORT`        | Port of your Redis cloud instance.           |
| `REDIS_USERNAME`    | Username for Redis cloud                     |
| `REDIS_PASSWORD`    | Password for Redis cloud                     |


### Frontend (`frontend/.env`)

| Variable Name             | Description                                          |
|---------------------------|------------------------------------------------------|
| `REACT_APP_BASE_URL`      | URL of the backend API (e.g., http://localhost:8002) |


4. **Run the frontend**

```bash
cd insightPDF-frontend
npm start
```

5. **Run the backend**

```bash
cd insightPDF-backend
node server.js
```

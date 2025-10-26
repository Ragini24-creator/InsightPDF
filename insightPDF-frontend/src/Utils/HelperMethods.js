// let baseURL = process.env.REACT_APP_BASE_URL;
let baseURL =  "http://localhost:8002"


// Process a new user query
export async function sendQuery(sessionId, query) {
    const response = await fetch(`${baseURL}/api/users/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, query })
    });

    const data = await response.json();
    console.log('response from chat bot: ', data)
    return { answer: data?.answer, citations: data?.citations };
}

// clear chat history
export async function clearChatHistory(sessionId) {
    const response = await fetch(`${baseURL}/api/users/session/${sessionId}`, {
        method: 'DELETE',
    });

    if (!response.status === 200) {
        return false;
    }

    return true;
}


export async function getChatHistory(sessionId) {
    const response = await fetch(`${baseURL}/api/users/history/${sessionId}`);

    if (response) {
        const data = await response.json();

        return { sessionId: data?.sessionId, history: data?.history || [] };
    } else {
        // if somehow session expired or not found in Redis, then reset
        localStorage.removeItem("sessionId");

        return await createSession();
    }
}

export async function createSession() {
    const response = await fetch(`${baseURL}/api/users/session/create`, { method: "POST" });

    const data = await response.json();

    const sessionId = data?.sessionId;

    localStorage.setItem("sessionId", sessionId);

    return { sessionId, history: [] };
}

// "proxy": "http://localhost:5000"
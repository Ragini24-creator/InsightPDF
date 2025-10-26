import TypingIndicator from './TypingIndicator'


export default function ChatWindow(props) {
    const { messages, isLoading, onGoToPage } = props;

    return (
        <div className="chat-window">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={msg.role === "user" ? "user-msg" : "bot-msg"}
                >
                    {/* Message text */}
                    <div>{msg.text}</div>

                    {/* Citation buttons (if any) */}
                    {msg.citations && msg.citations.length > 0 && (
                        <div className="citations">
                            {msg.citations.map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => onGoToPage(pageNum)}
                                    className="citation-btn"
                                >
                                    Page {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {isLoading && <TypingIndicator />}
        </div>

    )
}
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setPrevChats,
        setNewChat,
        prevChats,
        theme,
        setTheme
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(
                "http://localhost:8080/api/chat",
                options
            );

            const res = await response.json();
            setReply(res.reply);
        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => [
                ...prevChats,
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }
            ]);
        }

        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatWindow">

            {/* NAVBAR */}

            <div className="navbar">

                <div className="logoTitle">
                    <span>✨ SigmaGPT</span>
                </div>

                <div className="navActions">

                    <button
                        className="themeBtn"
                        onClick={() =>
                            setTheme(
                                theme === "dark"
                                    ? "light"
                                    : "dark"
                            )
                        }
                    >
                        {theme === "dark"
                            ? "☀️"
                            : "🌙"}
                    </button>

                    <div
                        className="userIconDiv"
                        onClick={handleProfileClick}
                    >
                        <span className="userIcon">
                            <i className="fa-solid fa-user"></i>
                        </span>
                    </div>

                </div>
            </div>

            {/* DROPDOWN */}

            {
                isOpen &&
                <div className="dropDown">

                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i>
                        Settings
                    </div>

                    <div className="dropDownItem">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upgrade Plan
                    </div>

                    <div className="dropDownItem">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        Logout
                    </div>

                </div>
            }

            {/* WELCOME SCREEN */}

            {
                prevChats.length === 0 &&
                (
                    <div className="welcomeSection">

                        <h1>
                            Welcome to SigmaGPT 🚀
                        </h1>

                        <p>
                            Your AI assistant powered by Groq.
                        </p>

                        <div className="promptCards">

                            <div
                                className="promptCard"
                                onClick={() =>
                                    setPrompt(
                                        "Explain React Hooks with examples"
                                    )
                                }
                            >
                                ⚛️ Explain React Hooks
                            </div>

                            <div
                                className="promptCard"
                                onClick={() =>
                                    setPrompt(
                                        "Teach me Dynamic Programming"
                                    )
                                }
                            >
                                💻 Dynamic Programming
                            </div>

                            <div
                                className="promptCard"
                                onClick={() =>
                                    setPrompt(
                                        "Create a Node.js REST API"
                                    )
                                }
                            >
                                🚀 Build Node API
                            </div>

                            <div
                                className="promptCard"
                                onClick={() =>
                                    setPrompt(
                                        "Generate interview questions"
                                    )
                                }
                            >
                                🎯 Interview Questions
                            </div>

                        </div>

                    </div>
                )
            }

            <Chat />

            <ScaleLoader
                color={theme === "dark"
                    ? "#ffffff"
                    : "#111827"}
                loading={loading}
            />

            <div className="chatInput">

                <div className="inputBox">

                    <input
                        placeholder="Message SigmaGPT..."
                        value={prompt}
                        onChange={(e) =>
                            setPrompt(e.target.value)
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter"
                                ? getReply()
                                : ""
                        }
                    />

                    <div
                        id="submit"
                        onClick={getReply}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>

                </div>

                <p className="info">
                    SigmaGPT can make mistakes.
                    Verify important information.
                </p>

            </div>

        </div>
    );
}

export default ChatWindow;
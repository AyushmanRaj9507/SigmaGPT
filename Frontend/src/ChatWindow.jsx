import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useRef } from "react";

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
    const dropdownRef = useRef(null);

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
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    
    const downloadChat = () => {
        setIsOpen(false);

        let textContent = "";

        prevChats.forEach((chat) => {
            textContent += `${chat.role.toUpperCase()}: ${chat.content}\n\n`;
        });

        const blob = new Blob([textContent], {
            type: "text/plain;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;

        a.download = `chat_${Date.now()}.txt`;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    };

    const exportToPDF = async () => {
        setIsOpen(false);

        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();

        doc.setFont("helvetica");
        doc.setFontSize(12);

        let y = 10;

        prevChats.forEach((chat) => {
            const role = chat.role.toUpperCase();
            const text = `${role}: ${chat.content}`;

            const lines = doc.splitTextToSize(text, 180);

            doc.text(lines, 10, y);

            y += lines.length * 7;

            if (y > 270) {
                doc.addPage();
                y = 10;
            }
        });

        doc.save(`chat_${Date.now()}.pdf`);
    };

    const handleSettings = () => {
        setIsOpen(false);
        alert("Settings page open (you can build later)");
    };

    const handleUpgrade = () => {
        setIsOpen(false);
        alert("Upgrade plan page (coming soon)");
    };

    const handleLogout = () => {
        setIsOpen(false);

        setPrevChats([]);
        setPrompt("");
        setReply("");

        localStorage.clear();

        window.location.href = "/login";
    };
    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatWindow">

            {/* NAVBAR */}

            <div className="navbar">

                <div className="logoTitle">
                    <span>✨ IntelliChat</span>
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
                <div className="dropDown" ref={dropdownRef}>

                     <div className="dropDownItem" onClick={exportToPDF}>
                        📄 Export Chat to PDF
                    </div>

                    <div className="dropDownItem" onClick={downloadChat}>
                        ⬇️ Download Chat (Text File)
                    </div>


                    <div className="dropDownItem" onClick={handleUpgrade}>
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upgrade Plan
                    </div>

                    <div className="dropDownItem" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            🚪 Logout
                    </div>

                </div>
            }

            {/* WELCOME SCREEN */}

            {
                prevChats.length === 0 &&
                (
                    <div className="welcomeSection">

                        <h1>
                            Welcome to IntelliChat 🚀
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
                    IntelliChat can make mistakes.
                    Verify important information.
                </p>

            </div>

        </div>
    );
}

export default ChatWindow;
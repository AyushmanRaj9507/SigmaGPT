import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats
    } = useContext(MyContext);

    const [search, setSearch] = useState("");

    const getAllThreads = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/thread"
            );

            const res = await response.json();

            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setAllThreads(filteredData);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(
                `http://localhost:8080/api/thread/${newThreadId}`
            );

            const res = await response.json();

            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/thread/${threadId}`,
                {
                    method: "DELETE"
                }
            );

            await response.json();

            setAllThreads(prev =>
                prev.filter(
                    thread => thread.threadId !== threadId
                )
            );

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    };

    const filteredThreads = allThreads.filter(thread =>
        thread.title
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <section className="sidebar">

            {/* Header */}

            <div>

                <button onClick={createNewChat}>
                    <img
                        src="src/assets/blacklogo.png"
                        alt="gpt logo"
                        className="logo"
                    />

                    <span>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </span>
                </button>

                <div className="chatStats">
                    Chats ({allThreads.length})
                </div>

                <div className="searchBox">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

            </div>

            {/* Chat History */}

            <ul className="history">
                {
                    filteredThreads.map((thread, idx) => (
                        <li
                            key={idx}
                            onClick={() =>
                                changeThread(
                                    thread.threadId
                                )
                            }
                            className={
                                thread.threadId === currThreadId
                                    ? "highlighted"
                                    : ""
                            }
                        >
                            <span className="threadTitle">
                                {thread.title}
                            </span>

                            <i
                                className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(
                                        thread.threadId
                                    );
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

            {/* Footer */}

            <div className="sign">
                <p>
                    IntelliChat ⚡
                </p>
                <p className="version">
                    Powered by Groq ...
                </p>
                <br></br>
                <p>© 2026 Ayushman Raj</p>
            </div>

        </section>
    );
}

export default Sidebar;
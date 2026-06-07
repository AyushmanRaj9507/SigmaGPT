import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);
            return;
        }

        if (!prevChats?.length) return;

        const content = reply.split(" ");

        let idx = 0;

        const interval = setInterval(() => {
            setLatestReply(
                content.slice(0, idx + 1).join(" ")
            );

            idx++;

            if (idx >= content.length) {
                clearInterval(interval);
            }
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply]);

    return (
        <div className="chats">

            {/* OLD CHATS */}

            {
                prevChats?.slice(0, -1).map((chat, idx) => (
                    <div
                        key={idx}
                        className={
                            chat.role === "user"
                                ? "userDiv"
                                : "gptDiv"
                        }
                    >
                        {
                            chat.role === "user" ? (

                                <p className="userMessage">
                                    {chat.content}
                                </p>

                            ) : (

                                <div className="gptMessage">
                                    <ReactMarkdown
                                        rehypePlugins={[
                                            rehypeHighlight
                                        ]}
                                    >
                                        {chat.content}
                                    </ReactMarkdown>
                                </div>

                            )
                        }
                    </div>
                ))
            }

            {/* LAST MESSAGE */}

            {
                prevChats.length > 0 && (

                    latestReply === null ? (

                        <div
                            className="gptDiv"
                            key="non-typing"
                        >
                            <div className="gptMessage">
                                <ReactMarkdown
                                    rehypePlugins={[
                                        rehypeHighlight
                                    ]}
                                >
                                    {
                                        prevChats[
                                            prevChats.length - 1
                                        ].content
                                    }
                                </ReactMarkdown>
                            </div>
                        </div>

                    ) : (

                        <div
                            className="gptDiv"
                            key="typing"
                        >
                            <div className="gptMessage">
                                <ReactMarkdown
                                    rehypePlugins={[
                                        rehypeHighlight
                                    ]}
                                >
                                    {latestReply}
                                </ReactMarkdown>
                            </div>
                        </div>

                    )
                )
            }

        </div>
    );
}

export default Chat;
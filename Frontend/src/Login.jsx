import { useState } from "react";

function Login() {
    const [name, setName] = useState("");

    const handleLogin = () => {
        if (!name.trim()) return;

        localStorage.setItem("user", name);

        window.location.href = "/";
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2>🚀 SigmaGPT Login</h2>

                <input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                />

                <button onClick={handleLogin} style={styles.button}>
                    Login
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a"
    },
    box: {
        padding: "30px",
        background: "#1e293b",
        borderRadius: "12px",
        textAlign: "center",
        color: "white",
        width: "300px"
    },
    input: {
        width: "100%",
        padding: "10px",
        marginTop: "15px",
        borderRadius: "8px",
        border: "none"
    },
    button: {
        marginTop: "15px",
        width: "100%",
        padding: "10px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    }
};

export default Login;
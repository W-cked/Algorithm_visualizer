import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import styles from "../../css/Stack.module.css";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

const Stack = () => {
    const [stack, setStack] = useState([10, 20, 30, 40, 50]);
    const [inputValue, setInputValue] = useState("");
    const [snackbarMessages, setSnackbarMessages] = useState([]);

    const push = async () => {
        if (inputValue !== "") {
            setStack((prevStack) => [...prevStack, inputValue]);
            if (localStorage.getItem("userInfo")) {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));

                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                    withCredentials: true,
                };
                const { data } = await axios.post(
                    import.meta.env.VITE_topic,
                    {
                        userID: userInfo.userID,
                        topic: "Stack",
                        completed: true,
                    },
                    config
                );

                console.log("Submitted:", {
                    data,
                });
            }
            setInputValue("");
            setSnackbarMessages((prevMessages) => [
                ...prevMessages,
                `Element ${inputValue} pushed!`,
            ]);
            setTimeout(() => {
                setSnackbarMessages((prevMessages) => prevMessages.slice(1));
            }, 3000);
        }
    };

    const pop = () => {
        if (stack.length > 0) {
            const poppedElement = stack.pop();
            setStack([...stack]);
            setSnackbarMessages((prevMessages) => [
                ...prevMessages,
                `Element ${poppedElement} popped!`,
            ]);
            setTimeout(() => {
                setSnackbarMessages((prevMessages) => prevMessages.slice(1));
            }, 3000);
        }
    };

    return (
        <>
            <SectionNav />
            <div className="pdp-container">
                {/* ═══════════════════════════════════════════
                    LEFT COLUMN: PRODUCT SHOWCASE STAGE
                    ═══════════════════════════════════════════ */}
                <div className="pdp-showcase">
                    <div className="showcase-stage">
                        <div className={styles.stackbox} style={{ display: 'flex', flexDirection: 'column-reverse', gap: '10px', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            <AnimatePresence>
                                {stack.map((element, index) => (
                                    <motion.div 
                                        key={`${index}-${element}`} 
                                        layout
                                        initial={{ opacity: 0, y: -50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className={styles.stackelement}
                                    >
                                        {element}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    RIGHT COLUMN: CONFIGURATION PANEL
                    ═══════════════════════════════════════════ */}
                <div className="pdp-config">
                    <div className="config-header">
                        <div className="config-category">Linear Data Structure</div>
                        <h1 className="config-title">Stack</h1>
                        <div className="config-rating">
                            ★★★★★ <span style={{ color: "var(--text-muted)" }}>(512 reviews)</span>
                        </div>
                        <div className="config-price">
                            Free <span>₹4.99</span>
                        </div>
                    </div>

                    <div className="config-section">
                        <h3>Configuration</h3>
                        <div className="config-controls" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Enter value"
                                    style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)" }}
                                />
                                <button className="btn-primary" onClick={push} style={{ width: 'auto' }}>Push</button>
                            </div>
                            <button className="btn-secondary" onClick={pop}>Pop</button>
                        </div>
                    </div>

                    <div className="config-section">
                        <h3>Product Details</h3>
                        <p className="config-theory">
                            A Stack is a linear data structure that follows the Last In, First Out (LIFO) principle. Elements are added (pushed) and removed (popped) from the same end, called the "top". It is heavily utilized in function call management, expression evaluation, and undo mechanisms in software applications.
                        </p>
                    </div>

                    <div className="config-section">
                        <h3>Live Diagnostic Log</h3>
                        <div className="log-box">
                            <AnimatePresence mode="popLayout">
                                {snackbarMessages.length > 0 ? (
                                    snackbarMessages.map((msg, idx) => (
                                        <motion.div 
                                            key={`${msg}-${idx}`}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {msg}
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div 
                                        key="ready"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Ready to configure.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Stack;

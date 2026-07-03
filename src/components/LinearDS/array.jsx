import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import styles from "../../css/Array.module.css";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

const ArrayComponent = () => {
    const [arrayType, setArrayType] = useState("2D");
    const [inputRows, setInputRows] = useState(1);
    const [inputCols, setInputCols] = useState(5);
    const [array, setArray] = useState([]);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const generateArray = () => {
        const newArray = [];
        const rows = parseInt(inputRows);
        const cols = parseInt(inputCols);

        if (arrayType === "1D") {
            for (let i = 0; i < cols; i++) {
                newArray.push({
                    id: `${i}`,
                    distance: Infinity,
                    isVisited: false,
                    previousNode: null,
                });
            }
        } else {
            for (let i = 0; i < rows; i++) {
                const row = [];
                for (let j = 0; j < cols; j++) {
                    row.push({
                        id: `${i}_${j}`,
                        distance: Infinity,
                        isVisited: false,
                        previousNode: null,
                    });
                }
                newArray.push(row);
            }
        }
        return newArray;
    };

    useEffect(() => {
        setArray(generateArray());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputRows, inputCols, arrayType]);

    const markAsVisited = async (rowIndex, colIndex) => {
        if (arrayType === "1D") {
            const newArray = array.map((cell, index) => {
                if (index === colIndex) {
                    return { ...cell, isVisited: !cell.isVisited };
                }
                return cell;
            });
            setArray(newArray);
        } else {
            const newArray = array.map((row, rIdx) =>
                Array.isArray(row)
                    ? row.map((cell, cIdx) => {
                          if (rIdx === rowIndex && cIdx === colIndex) {
                              return { ...cell, isVisited: !cell.isVisited };
                          }
                          return cell;
                      })
                    : row
            );
            setArray(newArray);
        }
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
                { userID: userInfo.userID, topic: "Array", completed: true },
                config
            );

            console.log("Submitted:", {
                data,
            });
        }
        setSnackbarMessage(
            `Cell at row ${rowIndex}, column ${colIndex} marked as visited`
        );
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);
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
                        <div className={styles.gridbox}>
                            {arrayType === "1D" ? (
                                <div className={styles.gridRow}>
                                    <AnimatePresence>
                                        {array.map((cell, colIndex) => (
                                            <motion.div
                                                key={cell.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                className={`${styles.gridCell} ${
                                                    cell.isVisited ? styles.visited : ""
                                                }`}
                                                onClick={() => markAsVisited(0, colIndex)}
                                            >
                                                {cell.id}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                array.map((row, rowIndex) => (
                                    <div key={rowIndex} className={styles.gridRow}>
                                        <AnimatePresence>
                                            {Array.isArray(row) &&
                                                row.map((cell, colIndex) => (
                                                    <motion.div
                                                        key={cell.id}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                        className={`${styles.gridCell} ${
                                                            cell.isVisited ? styles.visited : ""
                                                        }`}
                                                        onClick={() =>
                                                            markAsVisited(rowIndex, colIndex)
                                                        }
                                                    >
                                                        {cell.id}
                                                    </motion.div>
                                                ))}
                                        </AnimatePresence>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    RIGHT COLUMN: CONFIGURATION PANEL
                    ═══════════════════════════════════════════ */}
                <div className="pdp-config">
                    <div className="config-header">
                        <div className="config-category">Linear Data Structure</div>
                        <h1 className="config-title">Array</h1>
                        <div className="config-rating">
                            ★★★★☆ <span style={{ color: "var(--text-muted)" }}>(1,024 reviews)</span>
                        </div>
                        <div className="config-price">
                            Free <span>₹5.99</span>
                        </div>
                    </div>

                    <div className="config-section">
                        <h3>Configuration</h3>
                        <div className="config-controls" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <label style={{ display: "flex", flexDirection: "column", gap: "5px", color: "var(--text-secondary)" }}>
                                Array Type:
                                <select
                                    value={arrayType}
                                    onChange={(e) => setArrayType(e.target.value)}
                                    style={{ padding: "8px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)" }}
                                >
                                    <option value="1D">1D</option>
                                    <option value="2D">2D</option>
                                </select>
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", gap: "5px", color: "var(--text-secondary)" }}>
                                Rows:
                                <input
                                    type="number"
                                    value={inputRows}
                                    onChange={(e) => setInputRows(e.target.value)}
                                    disabled={arrayType === "1D"}
                                    style={{ padding: "8px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)" }}
                                />
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", gap: "5px", color: "var(--text-secondary)" }}>
                                Columns:
                                <input
                                    type="number"
                                    value={inputCols}
                                    onChange={(e) => setInputCols(e.target.value)}
                                    style={{ padding: "8px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)" }}
                                />
                            </label>
                        </div>
                        <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                            Click on the generated array cells to mark them as visited!
                        </p>
                    </div>

                    <div className="config-section">
                        <h3>Product Details</h3>
                        <p className="config-theory">
                            An array is a fundamental linear data structure that stores a collection of elements in contiguous memory locations. This layout guarantees highly efficient O(1) random access. However, inserting or deleting elements from the middle is costly due to the required shifting of elements.
                        </p>
                    </div>

                    <div className="config-section">
                        <h3>Live Diagnostic Log</h3>
                        <div className="log-box">
                            <AnimatePresence mode="popLayout">
                                <motion.div 
                                    key={snackbarMessage || "ready"}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {snackbarMessage || "Ready to configure."}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ArrayComponent;

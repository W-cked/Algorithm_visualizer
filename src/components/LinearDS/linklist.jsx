import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import styles from "../../css/Linklist.module.css";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.isVisited = false;
    }
}

const LinkedList = () => {
    const [nodeValue, setNodeValue] = useState("");
    const [head, setHead] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [editNode, setEditNode] = useState(null);
    const [editValue, setEditValue] = useState("");

    const addNode = async () => {
        if (nodeValue.trim() === "") return;
        const newNode = new Node(nodeValue);
        if (!head) {
            setHead(newNode);
        } else {
            let currentNode = head;
            while (currentNode.next) {
                currentNode = currentNode.next;
            }
            currentNode.next = newNode;
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
                {
                    userID: userInfo.userID,
                    topic: "LinkedList",
                    completed: true,
                },
                config
            );

            console.log("Submitted:", {
                data,
            });
        }
        setNodeValue("");
        displaySnackbar(`Node "${newNode.value}" added`);
    };

    const deleteNode = (value) => {
        if (!head) return;
        if (head.value === value) {
            setHead(head.next);
            displaySnackbar(`Node "${value}" deleted`);
            return;
        }
        let currentNode = head;
        let previousNode = null;
        while (currentNode && currentNode.value !== value) {
            previousNode = currentNode;
            currentNode = currentNode.next;
        }
        if (currentNode) {
            if (previousNode) {
                previousNode.next = currentNode.next;
            }
            displaySnackbar(`Node "${value}" deleted`);
        }
        setHead({ ...head }); // trigger re-render
    };

    const markAsVisited = (node) => {
        node.isVisited = !node.isVisited;
        setHead({ ...head }); // trigger re-render
        displaySnackbar(
            `Node "${node.value}" marked as ${
                node.isVisited ? "visited" : "not visited"
            }`
        );
    };

    const clearList = () => {
        setHead(null);
        displaySnackbar("List cleared");
    };

    const displaySnackbar = (message) => {
        setSnackbarMessage(message);
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 3000);
    };

    const handleEdit = (node) => {
        setEditNode(node);
        setEditValue(node.value);
    };

    const handleSave = (node) => {
        if (editValue === "") {
            displaySnackbar(`Node "${node.value}" can't be empty`);
            setEditNode(null);
            setHead({ ...head });
            return;
        }
        node.value = editValue;
        setEditNode(null);
        setHead({ ...head }); // trigger re-render
        displaySnackbar(`Node "${node.value}" updated`);
    };

    const traverse = () => {
        let currentNode = head;
        const listItems = [];
        while (currentNode) {
            const nodeRef = currentNode; // Capture the current node reference
            listItems.push(
                <motion.div 
                    layout 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, scale: 0.5 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    key={currentNode.value} 
                    className={styles.listItem}
                >
                    {editNode === nodeRef ? (
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(nodeRef)}
                            autoFocus
                            style={{ padding: "5px", borderRadius: "4px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)" }}
                        />
                    ) : (
                        <span onClick={() => handleEdit(nodeRef)} style={{ cursor: "pointer", fontWeight: "bold", fontSize: "1.2rem" }}>
                            {currentNode.value}
                        </span>
                    )}
                    <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                        <button className="btn-secondary" style={{ padding: "4px 8px", fontSize: "0.8rem" }} onClick={() => deleteNode(nodeRef.value)}>
                            Delete
                        </button>
                        <button className="btn-secondary" style={{ padding: "4px 8px", fontSize: "0.8rem" }} onClick={() => markAsVisited(nodeRef)}>
                            {nodeRef.isVisited ? "Unmark" : "Mark"}
                        </button>
                    </div>
                    {nodeRef.isVisited && <span style={{ color: "var(--accent-color)", marginTop: "5px", fontSize: "0.8rem" }}>Visited</span>}
                </motion.div>
            );
            currentNode = currentNode.next;
        }
        return listItems;
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
                        <div className={styles.listContainer} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                            <AnimatePresence>
                                {traverse()}
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
                        <h1 className="config-title">Linked List</h1>
                        <div className="config-rating">
                            ★★★★☆ <span style={{ color: "var(--text-muted)" }}>(786 reviews)</span>
                        </div>
                        <div className="config-price">
                            Free <span>₹6.99</span>
                        </div>
                    </div>

                    <div className="config-section">
                        <h3>Configuration</h3>
                        <div className="config-controls" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input
                                    type="text"
                                    value={nodeValue}
                                    onChange={(e) => setNodeValue(e.target.value)}
                                    placeholder="Enter node value"
                                    style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)" }}
                                />
                                <button className="btn-primary" onClick={addNode} style={{ width: 'auto' }}>Add Node</button>
                            </div>
                            <button className="btn-secondary" onClick={clearList}>Clear List</button>
                        </div>
                        <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                            Click on a node's value to edit it.
                        </p>
                    </div>

                    <div className="config-section">
                        <h3>Product Details</h3>
                        <p className="config-theory">
                            A Linked List is a linear data structure wherein elements are not stored in contiguous memory locations. Instead, each element (node) contains a data part and a reference (link) to the next node in the sequence. It allows for efficient insertions and deletions compared to arrays, but random access is not possible as elements must be accessed sequentially.
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

export default LinkedList;

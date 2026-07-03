import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import axios from "axios";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

function BinaryTree() {
    const svgRef = useRef(null);

    const [treeData, setTreeData] = useState(null);
    const [nodeNumber, setNodeNumber] = useState("");
    const [targetNodeName, setTargetNodeName] = useState("");
    const [newNodeName, setNewNodeName] = useState("");
    const [currentStep, setCurrentStep] = useState("Ready to configure.");
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (!treeData) return;

        const width = 700;
        const height = 700;

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(50,50)");

        const treeLayout = d3.tree().size([width - 100, height - 100]);
        const rootNode = d3.hierarchy(treeData);
        treeLayout(rootNode);

        svg.selectAll(".link")
            .data(rootNode.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "#ccc")
            .attr("stroke-width", "2px")
            .attr(
                "d",
                d3
                    .linkVertical()
                    .y((d) => d.y)
                    .x((d) => d.x)
            );

        const nodes = svg
            .selectAll(".node")
            .data(rootNode.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", (d) => `translate(${d.x},${d.y})`);

        nodes
            .append("circle")
            .attr("r", 20)
            .attr("fill", "var(--primary-color)")
            .attr("stroke", "var(--border-color)")
            .attr("stroke-width", "2px");

        nodes
            .append("text")
            .attr("dy", ".35em")
            .attr("x", 0)
            .attr("fill", "#ffffff")
            .style("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text((d) => d.data.name);

    }, [treeData]);

    const generateNodes = (number) => {
        if (isNaN(number) || number <= 0) {
            alert("Please enter a valid number of nodes to generate!");
            return;
        }

        const createBinaryTree = (num) => {
            if (num === 0) return null;

            let count = 1;
            const root = { name: `${count}`, children: [] };
            const queue = [root];

            while (count < num) {
                const currentNode = queue.shift();

                if (count < num) {
                    count++;
                    const leftChild = { name: `${count}`, children: [] };
                    currentNode.children.push(leftChild);
                    queue.push(leftChild);
                }

                if (count < num) {
                    count++;
                    const rightChild = { name: `${count}`, children: [] };
                    currentNode.children.push(rightChild);
                    queue.push(rightChild);
                }
            }

            return root;
        };

        const newTreeData = createBinaryTree(number);
        setTreeData(newTreeData);
        setNodeNumber("");

        setCurrentStep(`Generated binary tree with ${number} nodes.`);
        setLogs((prevLogs) => [`Generated tree with ${number} nodes`, ...prevLogs]);
    };

    const updateNodeName = async (targetName, newName) => {
        if (!targetName || !newName) {
            alert("Both the current node name and the new node name must be provided!");
            return;
        }

        const updateNode = (node) => {
            if (node.name === targetName) {
                node.name = newName;
                return true;
            }
            if (node.children) {
                for (let child of node.children) {
                    if (updateNode(child)) {
                        return true;
                    }
                }
            }
            return false;
        };

        const newTreeData = { ...treeData };
        if (!updateNode(newTreeData)) {
            setCurrentStep(`Error: Node ${targetName} not found!`);
            alert("Node not found!");
            return;
        }

        if (localStorage.getItem("userInfo")) {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            axios.post(
                import.meta.env.VITE_topic,
                { userID: userInfo.userID, topic: "Binary Tree", completed: true },
                { headers: { "Content-type": "application/json" }, withCredentials: true }
            ).catch(console.error);
        }

        setTreeData(newTreeData);
        setTargetNodeName("");
        setNewNodeName("");

        setCurrentStep(`Updated node ${targetName} to ${newName}.`);
        setLogs((prevLogs) => [`Updated node ${targetName} to ${newName}`, ...prevLogs]);
    };

    return (
        <>
            <SectionNav />
            <div className="pdp-container">
                {/* ═══════════════════════════════════════════
                    LEFT COLUMN: PRODUCT SHOWCASE STAGE
                    ═══════════════════════════════════════════ */}
                <div className="pdp-showcase">
                    <div className="showcase-stage" style={{ minHeight: "700px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <svg ref={svgRef} style={{ width: "100%", height: "100%", maxWidth: "700px", maxHeight: "700px" }}></svg>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    RIGHT COLUMN: CONFIGURATION PANEL
                    ═══════════════════════════════════════════ */}
                <div className="pdp-config">
                    {/* Header */}
                    <div className="config-header">
                        <div className="config-category">Data Structure</div>
                        <h1 className="config-title">Binary Tree</h1>
                        <div className="config-rating">
                            ★★★★★ <span style={{ color: "var(--text-muted)" }}>(2.3k reviews)</span>
                        </div>
                        <div className="config-price">
                            Free <span>₹19.99</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="config-section">
                        <h3>Configuration</h3>
                        <div className="config-controls" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input
                                    type="number"
                                    value={nodeNumber}
                                    placeholder="Number of nodes"
                                    onChange={(e) => setNodeNumber(e.target.value)}
                                    style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-color)" }}
                                />
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => generateNodes(parseInt(nodeNumber))} 
                                >
                                    Generate Tree
                                </button>
                            </div>
                            <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                                <input
                                    type="text"
                                    value={targetNodeName}
                                    placeholder="Current node name"
                                    onChange={(e) => setTargetNodeName(e.target.value)}
                                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-color)" }}
                                />
                                <input
                                    type="text"
                                    value={newNodeName}
                                    placeholder="New node name"
                                    onChange={(e) => setNewNodeName(e.target.value)}
                                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-color)" }}
                                />
                                <button 
                                    className="btn-primary" 
                                    onClick={() => updateNodeName(targetNodeName, newNodeName)} 
                                    disabled={!treeData}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    Update Node Name
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Algorithm Specs / Theory */}
                    <div className="config-section">
                        <h3>Product Details</h3>
                        <p className="config-theory">
                            A Binary Tree is a hierarchical data structure in which each node has at most two children, referred to as the left child and the right child.
                            It forms the foundation for many search and sort algorithms (like Binary Search Trees and Heaps). 
                            Excellent for representing hierarchical relationships and enabling fast O(log n) searches when sorted.
                        </p>
                    </div>

                    {/* Live Specs / Execution Logs */}
                    <div className="config-section">
                        <h3>Live Diagnostic Log</h3>
                        <div className="log-box">
                            <motion.div 
                                key={currentStep}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {currentStep}
                            </motion.div>
                            <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "var(--text-muted)", maxHeight: "100px", overflowY: "auto" }}>
                                {logs.map((log, index) => (
                                    <div key={index}>{log}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BinaryTree;

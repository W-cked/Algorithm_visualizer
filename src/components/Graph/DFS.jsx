import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import axios from "axios";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

const Dfs = () => {
    const svgRef = useRef(null);
    const [treeData, setTreeData] = useState(null);
    const [nodeNumber, setNodeNumber] = useState("");
    const [targetNodeName, setTargetNodeName] = useState("");
    const [foundNode, setFoundNode] = useState(null);
    const [visitedNodes, setVisitedNodes] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
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
            .attr("fill", (d) => {
                if (foundNode && d.data.name === foundNode) return "var(--success-color)";
                if (visitedNodes.includes(d.data.name)) return "var(--primary-color)";
                return "var(--surface-color)";
            })
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
    }, [treeData, foundNode, visitedNodes]);

    const generateNodes = (number) => {
        if (isSearching) return;
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
        setFoundNode(null);
        setVisitedNodes([]);
        setLogs([]);
        setCurrentStep(`Generated binary tree with ${number} nodes.`);
    };

    const searchNodeName = async (targetName) => {
        if (isSearching) return;
        if (!targetName || !treeData) {
            alert("Please generate a tree and enter a node name to search for!");
            return;
        }

        setFoundNode(null);
        setVisitedNodes([]);
        setLogs([]);
        setIsSearching(true);
        setCurrentStep(`Initializing DFS search for node ${targetName}...`);

        const dfsSearch = async (node) => {
            setVisitedNodes((prevVisitedNodes) => [
                ...prevVisitedNodes,
                node.data.name,
            ]);
            setCurrentStep(`Visited node: ${node.data.name}`);
            setLogs((prevLogs) => [
                ...prevLogs,
                `Visited node: ${node.data.name}`,
            ]);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (node.data.name === targetName) {
                setFoundNode(targetName);
                setCurrentStep(`Found node: ${targetName}`);
                setLogs((prevLogs) => [
                    ...prevLogs,
                    `Success! Node ${targetName} found.`,
                ]);
                return true;
            }

            if (node.children) {
                for (let child of node.children) {
                    if (await dfsSearch(child)) {
                        return true;
                    }
                }
            }

            return false;
        };

        const rootNode = d3.hierarchy(treeData);
        const found = await dfsSearch(rootNode);
        
        if (!found) {
            setCurrentStep(`Search complete. Node ${targetName} was not found.`);
        } else {
            if (localStorage.getItem("userInfo")) {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                axios.post(
                    import.meta.env.VITE_topic,
                    { userID: userInfo.userID, topic: "DFS", completed: true },
                    { headers: { "Content-type": "application/json" }, withCredentials: true }
                ).catch(console.error);
            }
        }

        setIsSearching(false);
        setTargetNodeName("");
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
                        <div className="config-category">Graph Algorithm</div>
                        <h1 className="config-title">Depth-First Search (DFS)</h1>
                        <div className="config-rating">
                            ★★★★★ <span style={{ color: "var(--text-muted)" }}>(1.1k reviews)</span>
                        </div>
                        <div className="config-price">
                            Free <span>₹14.99</span>
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
                                    disabled={isSearching}
                                >
                                    Generate Tree
                                </button>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input
                                    type="text"
                                    value={targetNodeName}
                                    placeholder="Node name to search"
                                    onChange={(e) => setTargetNodeName(e.target.value)}
                                    style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-color)" }}
                                />
                                <button 
                                    className="btn-primary" 
                                    onClick={() => searchNodeName(targetNodeName)} 
                                    disabled={isSearching || !treeData}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                    Search Node
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Algorithm Specs / Theory */}
                    <div className="config-section">
                        <h3>Product Details</h3>
                        <p className="config-theory">
                            Depth-First Search (DFS) is a recursive traversal algorithm that explores as deeply as possible along each branch before backtracking. 
                            Uses a Stack structure (or recursion) to probe to the leaves of the graph or tree. 
                            Excellent for topological sorting, cycle detection, and solving maze puzzles. Time complexity is O(V + E) where V is vertices and E is edges.
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
                                {logs.map((log, i) => (
                                    <div key={i}>{log}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dfs;

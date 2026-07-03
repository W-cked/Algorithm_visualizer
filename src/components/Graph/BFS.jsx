import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";
import { motion } from "framer-motion";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

function Bfs() {
    const svgRef = useRef(null);
    const [treeData, setTreeData] = useState(null);
    const [nodeNumber, setNodeNumber] = useState("");
    const [targetNodeName, setTargetNodeName] = useState("");
    const [foundNode, setFoundNode] = useState(null);
    const [visitedNodes, setVisitedNodes] = useState([]);
    const [visitedLinks] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentStep, setCurrentStep] = useState("Ready to configure.");

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
            )
            .attr("stroke", (d) => {
                if (visitedLinks.includes(d.name)) return "red";
                return "#ccc";
            });

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
    }, [treeData, foundNode, visitedNodes, visitedLinks]);

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
        setVisitedNodes([]);
        setFoundNode(null);
        setCurrentStep(`Generated binary tree with ${number} nodes.`);
    };

    const searchNodeName = async (targetName) => {
        if (isSearching) return;
        setFoundNode(null);
        setVisitedNodes([]);
        if (!targetName || !treeData) {
            alert("Please generate a tree and enter a node name to search for!");
            return;
        }

        setIsSearching(true);
        setCurrentStep(`Initializing BFS search for node ${targetName}...`);

        const bfsSearch = (node) => {
            const queue = [node];
            const search = () => {
                if (queue.length === 0) {
                    setCurrentStep(`Search complete. Node ${targetName} was not found.`);
                    setIsSearching(false);
                    return;
                }
                const currentNode = queue.shift();
                setVisitedNodes((prevVisitedNodes) => [
                    ...prevVisitedNodes,
                    currentNode.name,
                ]);
                setCurrentStep(`Visiting node ${currentNode.name}...`);
                
                if (currentNode.name === targetName) {
                    setFoundNode(targetName);
                    setCurrentStep(`Success! Node ${targetName} found.`);
                    setIsSearching(false);
                    
                    if (localStorage.getItem("userInfo")) {
                        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                        axios.post(
                            import.meta.env.VITE_topic,
                            { userID: userInfo.userID, topic: "BFS", completed: true },
                            { headers: { "Content-type": "application/json" }, withCredentials: true }
                        ).catch(console.error);
                    }
                    return;
                }
                if (currentNode.children) {
                    queue.push(...currentNode.children);
                }
                setTimeout(search, 500);
            };
            search();
        };

        bfsSearch(treeData);
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
                        <h1 className="config-title">Breadth-First Search (BFS)</h1>
                        <div className="config-rating">
                            ★★★★★ <span style={{ color: "var(--text-muted)" }}>(1.2k reviews)</span>
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
                            Breadth-First Search (BFS) is a traversing algorithm that explores nodes layer by layer. 
                            It starts from the root node and visits all immediate neighbors before moving to the next level. 
                            Perfect for finding the shortest path in unweighted graphs or discovering nearby nodes quickly. 
                            Uses a Queue structure for optimal FIFO processing. Time complexity is O(V + E) where V is vertices and E is edges.
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
                                {visitedNodes.length > 0 && <p>Visited: {visitedNodes.join(" → ")}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Bfs;


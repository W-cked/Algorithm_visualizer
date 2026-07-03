import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";
import { motion } from "framer-motion";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

const BellmanFord = () => {
    const svgRef = useRef(null);
    const [searchSource, setSearchSource] = useState("");
    const [searchTarget, setSearchTarget] = useState("");
    const [shortestPath, setShortestPath] = useState(null);
    const [currentStep, setCurrentStep] = useState("Ready to configure.");
    const [isSearching, setIsSearching] = useState(false);
    const [data, setData] = useState({
        nodes: [],
        links: [],
        adjacencyList: {},
    });

    const bellmanFord = async (graph, startNode, endNode) => {
        if (!graph || !graph.adjacencyList) {
            throw new Error("Invalid graph");
        }

        const nodes = Object.keys(graph.adjacencyList);
        if (!nodes.includes(startNode) || !nodes.includes(endNode)) {
            throw new Error("Invalid start or end node");
        }

        const edges = graph.links;

        const distances = {};
        const predecessors = {};

        try {
            setIsSearching(true);
            // Step 1: initialize graph
            nodes.forEach((node) => {
                distances[node] = Infinity;
                predecessors[node] = null;
            });
            distances[startNode] = 0;

            setCurrentStep("Initialized distances: 0 for source, Infinity for others.");
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Step 2: relax edges repeatedly
            let updated = true;
            let iterations = 0;
            while (updated) {
                updated = false;
                for (let i = 0; i < edges.length; i++) {
                    const { source, target, weight } = edges[i];
                    setCurrentStep(`Checking edge from ${source.id} to ${target.id} (weight: ${weight})`);
                    
                    if (distances[source.id] + weight < distances[target.id]) {
                        distances[target.id] = distances[source.id] + weight;
                        predecessors[target.id] = source.id;
                        updated = true;
                        setCurrentStep(`Relaxed ${source.id} -> ${target.id}. New distance: ${distances[target.id]}`);
                        await new Promise((resolve) => setTimeout(resolve, 500));
                    }
                }
                iterations++;
                if (iterations > nodes.length - 1) {
                    setIsSearching(false);
                    setCurrentStep("Error: Graph contains a negative-weight cycle");
                    throw new Error("Graph contains a negative-weight cycle");
                }
            }

            // Extract shortest path
            let path = [];
            let currentNode = endNode;

            while (currentNode !== null) {
                path.push(currentNode);
                currentNode = predecessors[currentNode];
            }

            path.reverse();

            if (path[0] !== startNode) {
                setCurrentStep("No valid path exists between the specified nodes.");
                setIsSearching(false);
                throw new Error("No path exists between the specified nodes");
            }

            setCurrentStep(`Path found! ${path.join(" -> ")}`);
            await highlightPath(path);
            setShortestPath(path);
            setIsSearching(false);
        } catch (error) {
            console.error(error);
            setIsSearching(false);
            throw error;
        }
    };

    const generateRandomGraph = (numNodes, numLinks) => {
        if (isSearching) return;
        const nodes = [];
        const links = [];
        const adjacencyList = {};

        for (let i = 0; i < numNodes; i++) {
            const nodeId = `A${i}`;
            nodes.push({
                id: nodeId,
                x: Math.random() * 100,
                y: Math.random() * 100,
            });
            adjacencyList[nodeId] = [];
        }

        while (links.length < numLinks) {
            const sourceIndex = Math.floor(Math.random() * numNodes);
            const targetIndex = Math.floor(Math.random() * numNodes);

            if (sourceIndex !== targetIndex) {
                const sourceNode = nodes[sourceIndex].id;
                const targetNode = nodes[targetIndex].id;

                if (
                    !links.some(
                        (link) =>
                            (link.source === sourceNode &&
                                link.target === targetNode) ||
                            (link.source === targetNode &&
                                link.target === sourceNode)
                    )
                ) {
                    const weight = Math.floor(Math.random() * 10 + 1);
                    links.push({
                        source: sourceNode,
                        target: targetNode,
                        weight,
                    });
                    adjacencyList[sourceNode].push({
                        target: targetNode,
                        weight,
                    });
                    adjacencyList[targetNode].push({
                        target: sourceNode,
                        weight,
                    }); 
                }
            }
        }

        setData({ nodes, links, adjacencyList });
        setShortestPath(null);
        setCurrentStep("Generated new random graph.");
    };

    const handleSearch = async () => {
        if (isSearching) return;
        try {
            await bellmanFord(data, searchSource, searchTarget);

            if (localStorage.getItem("userInfo")) {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                axios.post(
                    import.meta.env.VITE_topic,
                    { userID: userInfo.userID, topic: "Bellman Ford", completed: true },
                    { headers: { "Content-type": "application/json" }, withCredentials: true }
                ).catch(console.error);
            }
        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
            setShortestPath(null);
        }
    };

    const highlightPath = async (path) => {
        const svg = d3.select(svgRef.current);

        svg.selectAll("line")
            .attr("stroke", "#999")
            .attr("stroke-width", (d) => Math.sqrt(d.weight));

        for (let i = 0; i < path.length - 1; i++) {
            const sourceNode = path[i];
            const targetNode = path[i + 1];

            svg.selectAll("line")
                .filter(
                    (d) =>
                        (d.source.id === sourceNode && d.target.id === targetNode) ||
                        (d.source.id === targetNode && d.target.id === sourceNode)
                )
                .attr("stroke", "var(--primary-color)")
                .attr("stroke-width", 5);

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    };

    useEffect(() => {
        generateRandomGraph(6, 10);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const svg = d3
            .select(svgRef.current)
            .attr("width", 700)
            .attr("height", 600);

        svg.selectAll("*").remove();

        svg.append("defs")
            .append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#999");

        const link = svg
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke-width", (d) => Math.sqrt(d.weight))
            .attr("marker-end", "url(#arrowhead)");

        const node = svg
            .append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", 8)
            .attr("fill", "var(--success-color)")
            .call(
                d3
                    .drag()
                    .on("start", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on("drag", (event, d) => {
                        d.fx = event.x;
                        d.fy = event.y;
                    })
                    .on("end", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0);
                        d.fx = null;
                        d.fy = null;
                    })
            );

        const label = svg
            .append("g")
            .selectAll("text")
            .data(data.nodes)
            .join("text")
            .attr("fill", "#ffffff")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .attr("dy", -12)
            .attr("dx", 12)
            .text((d) => d.id);

        const label2 = svg
            .append("g")
            .selectAll("text")
            .data(data.links)
            .join("text")
            .attr("fill", "#ffffff")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .attr("dy", -3)
            .attr("dx", 8)
            .text((links) => links.weight);

        const simulation = d3
            .forceSimulation(data.nodes)
            .force(
                "link",
                d3
                    .forceLink(data.links)
                    .id((d) => d.id)
                    .distance(150)
            )
            .force("charge", d3.forceManyBody().strength(-1000))
            .force("center", d3.forceCenter(700 / 2, 600 / 2));

        simulation.on("tick", () => {
            link.attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);

            label2
                .attr("x", (d) => (d.source.x + d.target.x) / 2)
                .attr("y", (d) => (d.source.y + d.target.y) / 2);

            node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
            label.attr("x", (d) => d.x).attr("y", (d) => d.y);
        });

        return () => {
            simulation.stop();
        };
    }, [data]);

    return (
        <>
            <SectionNav />
            <div className="pdp-container">
                {/* ═══════════════════════════════════════════
                    LEFT COLUMN: PRODUCT SHOWCASE STAGE
                    ═══════════════════════════════════════════ */}
                <div className="pdp-showcase">
                    <div className="showcase-stage" style={{ minHeight: "650px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <svg ref={svgRef} style={{ width: "100%", height: "100%", maxWidth: "700px", maxHeight: "600px" }}></svg>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    RIGHT COLUMN: CONFIGURATION PANEL
                    ═══════════════════════════════════════════ */}
                <div className="pdp-config">
                    {/* Header */}
                    <div className="config-header">
                        <div className="config-category">Greedy Algorithm</div>
                        <h1 className="config-title">Bellman-Ford Algorithm</h1>
                        <div className="config-rating">
                            ★★★★★ <span style={{ color: "var(--text-muted)" }}>(3.4k reviews)</span>
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
                                    type="text"
                                    value={searchSource}
                                    placeholder="Source Node (e.g., A0)"
                                    onChange={(e) => setSearchSource(e.target.value)}
                                    style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-color)" }}
                                />
                                <input
                                    type="text"
                                    value={searchTarget}
                                    placeholder="Target Node (e.g., A5)"
                                    onChange={(e) => setSearchTarget(e.target.value)}
                                    style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-color)" }}
                                />
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button 
                                    className="btn-primary" 
                                    onClick={handleSearch} 
                                    disabled={isSearching}
                                    style={{ flex: 1 }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                    Search Shortest Path
                                </button>
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => generateRandomGraph(6, 10)} 
                                    disabled={isSearching}
                                    style={{ flex: 1 }}
                                >
                                    Generate Random Graph
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Algorithm Specs / Theory */}
                    <div className="config-section">
                        <h3>Product Details</h3>
                        <p className="config-theory">
                            The Bellman-Ford algorithm finds the shortest path from a source node to all other nodes in a weighted graph. 
                            Unlike Dijkstra's algorithm, Bellman-Ford is capable of handling graphs with negative weight edges and can detect negative-weight cycles. 
                            It operates by relaxing all the edges |V| - 1 times, where |V| is the number of vertices. Time complexity is O(V * E).
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
                            <div style={{ marginTop: "10px", fontSize: "0.9rem", color: "var(--success-color)", fontWeight: "bold" }}>
                                {shortestPath && <p>Shortest Path: {shortestPath.join(" → ")}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BellmanFord;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import styles from "../../css/grid.module.css";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

const Dijkstra = () => {
    const [rows] = useState(20);
    const [cols] = useState(20);
    const [grid, setGrid] = useState([]);
    const [inputMode, setInputMode] = useState("Set Start");
    const [state, setState] = useState({
        start: "",
        end: "",
        walls: [],
        weights: [],
        path: [],
        visitedNodes: [],
        isSearching: false,
    });
    const [currentStep, setCurrentStep] = useState("Ready to configure.");

    const generateGrid = () => {
        const newGrid = [];
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
            newGrid.push(row);
        }
        return newGrid;
    };

    useEffect(() => {
        setGrid(generateGrid());
        // eslint-disable-next-line
    }, [rows, cols]);

    const handleCellClick = (rowIndex, colIndex) => {
        if (state.isSearching) return;
        const cellId = `${rowIndex}_${colIndex}`;

        setState((prevState) => {
            switch (inputMode) {
                case "Set Start":
                    setCurrentStep(`Start node set at [${rowIndex}, ${colIndex}].`);
                    return { ...prevState, start: cellId };
                case "Set End":
                    if (cellId !== prevState.start) {
                        setCurrentStep(`End node set at [${rowIndex}, ${colIndex}].`);
                        return { ...prevState, end: cellId };
                    }
                    break;
                case "Add Wall":
                    if (cellId !== prevState.start && cellId !== prevState.end) {
                        const walls = prevState.walls.includes(cellId)
                            ? prevState.walls.filter((id) => id !== cellId)
                            : [...prevState.walls, cellId];
                        return { ...prevState, walls };
                    }
                    break;
                case "Add Weight":
                    if (cellId !== prevState.start && cellId !== prevState.end) {
                        const weights = prevState.weights.includes(cellId)
                            ? prevState.weights.filter((id) => id !== cellId)
                            : [...prevState.weights, cellId];
                        return { ...prevState, weights };
                    }
                    break;
                default:
                    return prevState;
            }
            return prevState;
        });
    };

    const handleClear = () => {
        if (state.isSearching) return;
        setState({
            start: "",
            end: "",
            walls: [],
            weights: [],
            path: [],
            visitedNodes: [],
            isSearching: false,
        });
        setGrid(generateGrid());
        setCurrentStep("Grid cleared. Ready to configure.");
    };

    const getNeighbors = (grid, node) => {
        const [row, col] = node.id.split("_").map(Number);
        const neighbors = [];
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < rows - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < cols - 1) neighbors.push(grid[row][col + 1]);
        return neighbors.filter(
            (neighbor) => !neighbor.isVisited && !state.walls.includes(neighbor.id)
        );
    };

    const dijkstra = async () => {
        if (state.isSearching || !state.start || !state.end || !grid.length) {
            alert("Please set both a start and an end node.");
            return;
        }

        setState((prevState) => ({ ...prevState, isSearching: true, path: [], visitedNodes: [] }));
        
        // Reset grid distances
        const newGrid = generateGrid();
        setGrid(newGrid);

        setCurrentStep("Initializing Dijkstra's algorithm...");
        const startNode = newGrid.flat().find((cell) => cell.id === state.start);
        const endNode = newGrid.flat().find((cell) => cell.id === state.end);

        startNode.distance = 0;
        const unvisitedNodes = [...newGrid.flat()];
        const visitedList = [];

        while (unvisitedNodes.length) {
            unvisitedNodes.sort((a, b) => a.distance - b.distance);
            const closestNode = unvisitedNodes.shift();

            if (closestNode.distance === Infinity) break;
            if (closestNode.id === endNode.id) {
                visitedList.push(closestNode);
                break;
            }

            closestNode.isVisited = true;
            visitedList.push(closestNode);
            
            setState((prevState) => ({
                ...prevState,
                visitedNodes: [...visitedList],
            }));

            const neighbors = getNeighbors(newGrid, closestNode);

            for (const neighbor of neighbors) {
                const weight = state.weights.includes(neighbor.id) ? 7 : 1;
                const alt = closestNode.distance + weight;
                if (alt < neighbor.distance) {
                    neighbor.distance = alt;
                    neighbor.previousNode = closestNode;
                }
            }

            await new Promise((r) => setTimeout(r, 20));
            setGrid((prevGrid) => [...prevGrid]);
            setCurrentStep(`Visiting node ${closestNode.id} (distance: ${closestNode.distance})`);
        }

        const newPath = [];
        let currentNode = newGrid.flat().find((cell) => cell.id === state.end);

        if (currentNode.previousNode || currentNode.id === startNode.id) {
            while (currentNode) {
                newPath.unshift(currentNode);
                currentNode = currentNode.previousNode;
            }
            setCurrentStep(`Path found! Length: ${newPath.length}`);
        } else {
            setCurrentStep("No valid path exists between the start and end nodes.");
        }

        setState((prevState) => ({
            ...prevState,
            path: newPath,
            isSearching: false,
        }));

        if (newPath.length > 0 && localStorage.getItem("userInfo")) {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            axios.post(
                import.meta.env.VITE_topic,
                { userID: userInfo.userID, topic: "Dijkstra", completed: true },
                { headers: { "Content-type": "application/json" }, withCredentials: true }
            ).catch(console.error);
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
                    <div className="showcase-stage" style={{ minHeight: "650px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div className={styles.gridContainer} style={{ background: "white", padding: "10px", borderRadius: "8px" }}>
                            {grid.map((row, rowIndex) => (
                                <div key={rowIndex} className={styles.gridRow}>
                                    {row.map((cell, colIndex) => (
                                        <div
                                            key={cell.id}
                                            className={`${styles.gridCell} ${
                                                state.start === cell.id ? styles.start : ""
                                            } ${state.end === cell.id ? styles.end : ""} ${
                                                state.walls.includes(cell.id) ? styles.wall : ""
                                            } ${state.weights.includes(cell.id) ? styles.weight : ""} ${
                                                state.path.some((pathCell) => pathCell.id === cell.id) ? styles.path : ""
                                            } ${
                                                state.visitedNodes.some((visited) => visited.id === cell.id) ? styles.visited : ""
                                            }`}
                                            onClick={() => handleCellClick(rowIndex, colIndex)}
                                        ></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    RIGHT COLUMN: CONFIGURATION PANEL
                    ═══════════════════════════════════════════ */}
                <div className="pdp-config">
                    {/* Header */}
                    <div className="config-header">
                        <div className="config-category">Greedy Algorithm</div>
                        <h1 className="config-title">Dijkstra's Algorithm</h1>
                        <div className="config-rating">
                            ★★★★★ <span style={{ color: "var(--text-muted)" }}>(4.8k reviews)</span>
                        </div>
                        <div className="config-price">
                            Free <span>₹19.99</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="config-section">
                        <h3>Configuration</h3>
                        <div className="config-controls" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <select
                                    value={inputMode}
                                    onChange={(e) => setInputMode(e.target.value)}
                                    disabled={state.isSearching}
                                    style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-color)" }}
                                >
                                    <option value="Set Start">Set Start Node</option>
                                    <option value="Set End">Set End Node</option>
                                    <option value="Add Wall">Add Wall (Block path)</option>
                                    <option value="Add Weight">Add Weight (Costly path)</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button 
                                    className="btn-primary" 
                                    onClick={dijkstra} 
                                    disabled={state.isSearching || !state.start || !state.end}
                                    style={{ flex: 1 }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                    Find Path
                                </button>
                                <button 
                                    className="btn-secondary" 
                                    onClick={handleClear} 
                                    disabled={state.isSearching}
                                    style={{ flex: 1 }}
                                >
                                    Clear Grid
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Algorithm Specs / Theory */}
                    <div className="config-section">
                        <h3>Product Details</h3>
                        <p className="config-theory">
                            Dijkstra's Algorithm guarantees the shortest path between a starting node and all other nodes in a graph, as long as all edge weights are non-negative. 
                            It expands outwards from the start node, systematically evaluating and finalizing the lowest-cost paths. 
                            Extensively used in network routing protocols and mapping applications.
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dijkstra;

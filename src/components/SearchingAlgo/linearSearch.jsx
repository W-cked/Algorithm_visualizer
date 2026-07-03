import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

// Helper to generate a unique ID so framer-motion tracks the object
const generateId = () => Math.random().toString(36).substr(2, 9);

const LinearSearch = () => {
    // Array holds objects: { id, value, state: 'idle' | 'active' | 'sorted' }
    const [array, setArray] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [input, setInput] = useState("");
    const [currentStep, setCurrentStep] = useState("Ready to configure.");

    const generateNewArray = useCallback(() => {
        if (isSearching) return;
        const newArray = Array.from({ length: 25 }, () => ({
            id: generateId(),
            value: Math.floor(Math.random() * 350) + 20,
            state: 'idle'
        }));
        setArray(newArray);
        setCurrentStep("New dataset generated.");
    }, [isSearching]);

    useEffect(() => {
        generateNewArray();
    }, [generateNewArray]);

    const linearSearchAlgo = async () => {
        if (isNaN(input) || input === "") {
            alert("Please enter a valid number.");
            return;
        }
        setIsSearching(true);
        setCurrentStep("Initializing Linear Search sequence...");
        
        const val = parseInt(input, 10);
        let found = false;

        // Deep copy the array objects so we can mutate safely
        let arr = array.map(item => ({ ...item, state: 'idle' }));
        let n = arr.length;

        for (let i = 0; i < n; i++) {
            // Highlight the current element being checked
            arr.forEach(item => item.state = 'idle');
            arr[i].state = 'active';
            setArray([...arr]);
            
            setCurrentStep(`Checking index ${i} with value ${arr[i].value}`);
            await new Promise((resolve) => setTimeout(resolve, 500)); // Faster step speed

            if (arr[i].value === val) {
                setCurrentStep(`Found value ${val} at index ${i}!`);
                arr[i].state = 'sorted'; // Using 'sorted' class to signify 'found' (green)
                setArray([...arr]);
                found = true;
                await new Promise((resolve) => setTimeout(resolve, 1000));
                break;
            }
        }

        if (!found) {
            arr.forEach(item => item.state = 'idle');
            setArray([...arr]);
            setCurrentStep(`Value ${val} not found in the array.`);
        } else {
            setCurrentStep(`Algorithm sequence complete! Value ${val} was found.`);
        }

        if (localStorage.getItem("userInfo")) {
            try {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                await axios.post(
                    import.meta.env.VITE_topic,
                    { userID: userInfo.userID, topic: "LinearSearch", completed: true },
                    { headers: { "Content-type": "application/json" }, withCredentials: true }
                );
            } catch (e) {
                console.error("Progress saving failed", e);
            }
        }
        
        setIsSearching(false);
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
                        <div className="array-wrapper">
                            <AnimatePresence>
                                {array.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25,
                                            mass: 0.8
                                        }}
                                        className={`array-bar ${item.state}`}
                                        style={{ height: `${item.value}px` }}
                                    >
                                        <div className="bar-value">{item.value}</div>
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
                    {/* Header */}
                    <div className="config-header">
                        <div className="config-category">Searching Algorithm</div>
                        <h1 className="config-title">Linear Search</h1>
                        <div className="config-rating">
                            ★★★☆☆ <span style={{ color: "var(--text-muted)" }}>(620 reviews)</span>
                        </div>
                        <div className="config-price">
                            Free <span>₹4.99</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="config-section">
                        <h3>Configuration</h3>
                        <div className="config-controls">
                            <input 
                                type="number" 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                placeholder="Enter number to search..." 
                                style={{
                                    width: "100%", 
                                    padding: "12px", 
                                    marginBottom: "10px", 
                                    borderRadius: "8px", 
                                    border: "1px solid rgba(255,255,255,0.1)", 
                                    background: "rgba(0,0,0,0.2)", 
                                    color: "#fff",
                                    fontSize: "16px",
                                    outline: "none"
                                }}
                                disabled={isSearching} 
                            />
                            <button 
                                className="btn-primary" 
                                onClick={linearSearchAlgo} 
                                disabled={isSearching || !input}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                Search Now
                            </button>
                            <button 
                                className="btn-secondary" 
                                onClick={generateNewArray} 
                                disabled={isSearching}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 2v6h-6"></path>
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                    <path d="M3 3v5h5"></path>
                                </svg>
                                Generate New Dataset
                            </button>
                        </div>
                    </div>

                    {/* Algorithm Specs / Theory */}
                    <div className="config-section">
                        <h3>Product Details</h3>
                        <p className="config-theory">
                            Linear Search is a straightforward search algorithm with an O(n) time complexity.
                            It sequentially checks each element of the list until a match is found or the entire 
                            list has been traversed. While not the most efficient for large datasets, 
                            its simplicity and ability to operate on unsorted arrays make it highly versatile 
                            and a fundamental building block in computer science.
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

export default LinearSearch;

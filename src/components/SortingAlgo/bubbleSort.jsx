import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

// Helper to generate a unique ID so framer-motion tracks the object
const generateId = () => Math.random().toString(36).substr(2, 9);

const BubbleSort = () => {
    // Array holds objects: { id, value, state: 'idle' | 'active' | 'sorted' }
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [currentStep, setCurrentStep] = useState("Ready to configure.");

    const generateNewArray = useCallback(() => {
        if (isSorting) return;
        const newArray = Array.from({ length: 25 }, () => ({
            id: generateId(),
            value: Math.floor(Math.random() * 350) + 20,
            state: 'idle'
        }));
        setArray(newArray);
        setCurrentStep("New dataset generated.");
    }, [isSorting]);

    useEffect(() => {
        generateNewArray();
    }, [generateNewArray]);

    const bubbleSort = async () => {
        setIsSorting(true);
        setCurrentStep("Initializing Bubble Sort sequence...");
        
        // Deep copy the array objects so we can mutate safely
        let arr = array.map(item => ({ ...item, state: 'idle' }));
        let n = arr.length;
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // Highlight the two elements being compared
                arr[j].state = 'active';
                arr[j + 1].state = 'active';
                setArray([...arr]);
                setCurrentStep(`Comparing elements at index ${j} and ${j + 1}`);
                
                await new Promise((r) => setTimeout(r, 100)); // Animation pause

                if (arr[j].value > arr[j + 1].value) {
                    setCurrentStep(`Swapping ${arr[j].value} with ${arr[j + 1].value}`);
                    // Swap logic
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    setArray([...arr]);
                    
                    await new Promise((r) => setTimeout(r, 150)); // Swapping pause
                }
                
                // Unhighlight
                arr[j].state = 'idle';
                arr[j + 1].state = 'idle';
            }
            
            // The last element of this pass is now definitively sorted
            arr[n - i - 1].state = 'sorted';
            setArray([...arr]);
            await new Promise((r) => setTimeout(r, 50));
        }
        
        // Final polish pass to mark all as sorted (in case n=0 or loops finish)
        arr.forEach(item => item.state = 'sorted');
        setArray([...arr]);
        setCurrentStep("Algorithm sequence complete! All elements are sorted.");

        // Record completion
        if (localStorage.getItem("userInfo")) {
            try {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                await axios.post(
                    import.meta.env.VITE_topic,
                    { userID: userInfo.userID, topic: "BubbleSort", completed: true },
                    { headers: { "Content-type": "application/json" }, withCredentials: true }
                );
            } catch(e) {
                console.error("Progress saving failed", e);
            }
        }
        
        setIsSorting(false);
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
                        <div className="config-category">Sorting Algorithm</div>
                        <h1 className="config-title">Bubble Sort</h1>
                        <div className="config-rating">
                            ★★★★☆ <span style={{ color: "var(--text-muted)" }}>(890 reviews)</span>
                        </div>
                        <div className="config-price">
                            Free <span>₹9.99</span>
                        </div>
                    </div>

                    {/* Controls (Add to Cart logic) */}
                    <div className="config-section">
                        <h3>Configuration</h3>
                        <div className="config-controls">
                            <button 
                                className="btn-primary" 
                                onClick={bubbleSort} 
                                disabled={isSorting}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                Visualize Now
                            </button>
                            <button 
                                className="btn-secondary" 
                                onClick={generateNewArray} 
                                disabled={isSorting}
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
                            Bubble Sort is a simple sorting algorithm that repeatedly
                            steps through the list, compares adjacent elements and swaps
                            them if they are in the wrong order. The algorithm
                            gets its name from the way smaller elements
                            &quot;bubble&quot; to the top of the list. Great for educational purposes, but highly inefficient for large datasets with an O(n²) time complexity.
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

export default BubbleSort;

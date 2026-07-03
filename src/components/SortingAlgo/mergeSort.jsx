import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

const generateId = () => Math.random().toString(36).substr(2, 9);

const MergeSort = () => {
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

    async function merge(arr, start, mid, end) {
        let len1 = mid - start + 1;
        let len2 = end - mid;

        let first = new Array(len1);
        let second = new Array(len2);

        for (let i = 0; i < len1; i++) {
            first[i] = arr[start + i];
        }
        for (let i = 0; i < len2; i++) {
            second[i] = arr[mid + 1 + i];
        }

        let index1 = 0, index2 = 0;
        let k = start;

        while (index1 < len1 && index2 < len2) {
            first[index1].state = 'active';
            second[index2].state = 'active';
            setArray([...arr]);
            setCurrentStep(`Comparing ${first[index1].value} and ${second[index2].value}`);
            await new Promise((resolve) => setTimeout(resolve, 100));

            let targetItem;
            if (first[index1].value <= second[index2].value) {
                targetItem = first[index1];
                first[index1].state = 'idle';
                second[index2].state = 'idle';
                index1++;
            } else {
                targetItem = second[index2];
                first[index1].state = 'idle';
                second[index2].state = 'idle';
                index2++;
            }
            
            // Swap instead of overwrite to preserve unique IDs for Framer Motion
            let currentIdx = arr.findIndex(x => x.id === targetItem.id);
            let temp = arr[k];
            arr[k] = arr[currentIdx];
            arr[currentIdx] = temp;
            
            k++;
            
            setArray([...arr]);
            await new Promise((resolve) => setTimeout(resolve, 80));
        }

        while (index1 < len1) {
            setCurrentStep(`Placing remaining ${first[index1].value}`);
            let targetItem = first[index1];
            let currentIdx = arr.findIndex(x => x.id === targetItem.id);
            
            let temp = arr[k];
            arr[k] = arr[currentIdx];
            arr[currentIdx] = temp;
            
            first[index1].state = 'idle';
            index1++;
            k++;
            
            setArray([...arr]);
            await new Promise((resolve) => setTimeout(resolve, 80));
        }

        while (index2 < len2) {
            setCurrentStep(`Placing remaining ${second[index2].value}`);
            let targetItem = second[index2];
            let currentIdx = arr.findIndex(x => x.id === targetItem.id);
            
            let temp = arr[k];
            arr[k] = arr[currentIdx];
            arr[currentIdx] = temp;
            
            second[index2].state = 'idle';
            index2++;
            k++;
            
            setArray([...arr]);
            await new Promise((resolve) => setTimeout(resolve, 80));
        }
    }

    async function mergeSortHelper(arr, start, end) {
        if (start >= end) {
            return;
        }

        let mid = Math.floor((start + end) / 2);

        await mergeSortHelper(arr, start, mid);
        await mergeSortHelper(arr, mid + 1, end);

        await merge(arr, start, mid, end);
    }

    const mergeSortAlgo = async () => {
        setIsSorting(true);
        setCurrentStep("Initializing Merge Sort sequence...");
        
        let arrCopy = array.map(item => ({ ...item, state: 'idle' }));
        await mergeSortHelper(arrCopy, 0, arrCopy.length - 1);
        
        arrCopy.forEach(item => item.state = 'sorted');
        setArray([...arrCopy]);
        
        setCurrentStep("Algorithm sequence complete! All elements are sorted.");

        if (localStorage.getItem("userInfo")) {
            try {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                await axios.post(
                    import.meta.env.VITE_topic,
                    { userID: userInfo.userID, topic: "MergeSort", completed: true },
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
                        <h1 className="config-title">Merge Sort</h1>
                        <div className="config-rating">
                            ★★★★★ <span style={{ color: "var(--text-muted)" }}>(3,420 reviews)</span>
                        </div>
                        <div className="config-price">
                            Free <span>₹19.99</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="config-section">
                        <h3>Configuration</h3>
                        <div className="config-controls">
                            <button 
                                className="btn-primary" 
                                onClick={mergeSortAlgo} 
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
                            Merge Sort is an efficient, general-purpose, and comparison-based sorting algorithm. It is a stable sort based on the Divide and Conquer paradigm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves. It guarantees O(n log n) time complexity in all cases.
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

export default MergeSort;

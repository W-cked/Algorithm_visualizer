import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

// Layouts
import PublicLayout from "./components/PublicLayout";
import DashboardLayout from "./components/DashboardLayout";

// Public Pages
import Landing from "./components/public/Landing";
import About from "./components/public/About";
import Contact from "./components/public/Contact";
import Benefits from "./components/public/Benefits";
import Auth from "./user/auth";

// Dashboard Pages
import Dashboard from "./components/Dashboard";
import Profile from "./user/profile";

// Algorithms
import BubbleSort from "./components/SortingAlgo/bubbleSort";
import QuickSort from "./components/SortingAlgo/quickSort";
import MergeSort from "./components/SortingAlgo/mergeSort";
import SelectionSort from "./components/SortingAlgo/selectionSort";
import InsertionSort from "./components/SortingAlgo/insertionSort";

import BinarySearch from "./components/SearchingAlgo/binarySearch";
import LinearSearch from "./components/SearchingAlgo/linearSearch";

import Dijkstra from "./components/GreedyAlgo/dijkstra";
import BellmanFord from "./components/GreedyAlgo/bellmanFord";

import Dfs from "./components/Graph/DFS";
import Bfs from "./components/Graph/BFS";
import BinaryTree from "./components/Graph/binarytree";

import Linklist from "./components/LinearDS/linklist";
import Array from "./components/LinearDS/array";
import Stack from "./components/LinearDS/stack";
import Queue from "./components/LinearDS/queue";

function App() {
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "dark";
        if (savedTheme === "light") {
            document.body.classList.add("light-theme");
        } else {
            document.body.classList.remove("light-theme");
        }
    }, []);

    return (
        <Router>
            <Routes>
                {/* Public Marketing Site */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/benefits" element={<Benefits />} />
                    <Route path="/Auth" element={<Auth />} />
                </Route>

                {/* Web App Dashboard */}
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    
                    <Route path="/searching/binary" element={<BinarySearch />} />
                    <Route path="/searching/linear" element={<LinearSearch />} />
                    <Route path="/greedy/bellman-Ford" element={<BellmanFord />} />
                    <Route path="/greedy/dijkstra" element={<Dijkstra />} />
                    <Route path="/sorting/bubble" element={<BubbleSort />} />
                    <Route path="/sorting/quick" element={<QuickSort />} />
                    <Route path="/sorting/merge" element={<MergeSort />} />
                    <Route path="/sorting/selection" element={<SelectionSort />} />
                    <Route path="/sorting/insertion" element={<InsertionSort />} />
                    <Route path="/graph/bfs" element={<Bfs />} />
                    <Route path="/graph/dfs" element={<Dfs />} />
                    <Route path="/graph/binaryTree" element={<BinaryTree />} />
                    <Route path="/array" element={<Array />} />
                    <Route path="/stack" element={<Stack />} />
                    <Route path="/queue" element={<Queue />} />
                    <Route path="/linklist" element={<Linklist />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;

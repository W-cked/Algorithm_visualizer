import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../css/SectionNav.module.css";

const SectionNav = () => {
    const location = useLocation();
    const path = location.pathname;

    const getLinkClass = (to) => {
        return path === to
            ? `${styles.navLink} ${styles.active}`
            : styles.navLink;
    };

    const renderLinks = () => {
        if (path.startsWith("/searching")) {
            return (
                <div className={styles.navLinks}>
                    <Link to="/searching/binary" className={getLinkClass("/searching/binary")}>Binary Search</Link>
                    <Link to="/searching/linear" className={getLinkClass("/searching/linear")}>Linear Search</Link>
                </div>
            );
        } else if (path.startsWith("/greedy")) {
            return (
                <div className={styles.navLinks}>
                    <Link to="/greedy/bellman-Ford" className={getLinkClass("/greedy/bellman-Ford")}>Bellman Ford</Link>
                    <Link to="/greedy/dijkstra" className={getLinkClass("/greedy/dijkstra")}>Dijkstra</Link>
                </div>
            );
        } else if (path.startsWith("/sorting")) {
            return (
                <div className={styles.navLinks}>
                    <Link to="/sorting/bubble" className={getLinkClass("/sorting/bubble")}>Bubble Sort</Link>
                    <Link to="/sorting/quick" className={getLinkClass("/sorting/quick")}>Quick Sort</Link>
                    <Link to="/sorting/merge" className={getLinkClass("/sorting/merge")}>Merge Sort</Link>
                    <Link to="/sorting/selection" className={getLinkClass("/sorting/selection")}>Selection Sort</Link>
                    <Link to="/sorting/insertion" className={getLinkClass("/sorting/insertion")}>Insertion Sort</Link>
                </div>
            );
        } else if (path.startsWith("/graph")) {
            return (
                <div className={styles.navLinks}>
                    <Link to="/graph/binaryTree" className={getLinkClass("/graph/binaryTree")}>Binary Tree</Link>
                    <Link to="/graph/bfs" className={getLinkClass("/graph/bfs")}>Breadth First Search</Link>
                    <Link to="/graph/dfs" className={getLinkClass("/graph/dfs")}>Depth First Search</Link>
                </div>
            );
        } else if (
            path.startsWith("/array") ||
            path.startsWith("/queue") ||
            path.startsWith("/stack") ||
            path.startsWith("/linkList")
        ) {
            return (
                <div className={styles.navLinks}>
                    <Link to="/array" className={getLinkClass("/array")}>Array</Link>
                    <Link to="/queue" className={getLinkClass("/queue")}>Queue</Link>
                    <Link to="/stack" className={getLinkClass("/stack")}>Stack</Link>
                    <Link to="/linkList" className={getLinkClass("/linkList")}>Linked List</Link>
                </div>
            );
        } else {
            return null;
        }
    };

    return <div className={styles.navContainer}>{renderLinks()}</div>;
};

export default SectionNav;

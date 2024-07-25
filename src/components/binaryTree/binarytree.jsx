import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Header from "../header";
import SectionNav from "../sectionNav";

function BinaryTree() {
    const svgRef = useRef(null);

    const [treeData, setTreeData] = useState(null); // Initialize with null to generate fresh data

    const [nodeNumber, setNodeNumber] = useState();
    const [targetNodeName, setTargetNodeName] = useState(""); // Node to be renamed
    const [newNodeName, setNewNodeName] = useState(""); // New name for the node

    // Effect to draw the tree when data changes
    useEffect(() => {
        if (!treeData) return;

        const width = 700;
        const height = 700;

        // Clear previous SVG content before re-rendering
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

        const nodes = svg
            .selectAll(".node")
            .data(rootNode.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", (d) => `translate(${d.x},${d.y})`);

        nodes.append("circle").attr("r", 8).attr("fill", "steelblue");

        nodes
            .append("text")
            .attr("dy", ".35em")
            .attr("x", (d) => (d.children ? -13 : 13))
            .attr("fill", "white")
            .style("text-anchor", (d) => (d.children ? "end" : "start"))
            .text((d) => d.data.name);

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
    }, [treeData]); // Re-render the tree when treeData changes

    // Function to generate a binary tree with a given number of nodes
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

                // Add left child
                if (count < num) {
                    count++;
                    const leftChild = { name: `${count}`, children: [] };
                    currentNode.children.push(leftChild);
                    queue.push(leftChild);
                }

                // Add right child
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
    };

    // Function to update the name of a node
    const updateNodeName = (targetName, newName) => {
        if (!targetName || !newName) {
            alert(
                "Both the current node name and the new node name must be provided!"
            );
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
            alert("Node not found!");
            return;
        }

        setTreeData(newTreeData);
        setTargetNodeName("");
        setNewNodeName("");
    };

    return (
        <div>
            <Header />
            <SectionNav />
            <h2>Binary Tree Visualization</h2>
            <svg ref={svgRef}></svg>
            <div style={{ marginTop: "20px" }}>
                <input
                    type="number"
                    value={nodeNumber}
                    placeholder="Number of nodes"
                    onChange={(e) => setNodeNumber(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <button onClick={() => generateNodes(parseInt(nodeNumber))}>
                    Generate Nodes
                </button>
            </div>
            <div style={{ marginTop: "20px" }}>
                <input
                    type="text"
                    value={targetNodeName}
                    placeholder="Current node name"
                    onChange={(e) => setTargetNodeName(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <input
                    type="text"
                    value={newNodeName}
                    placeholder="New node name"
                    onChange={(e) => setNewNodeName(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <button
                    onClick={() => updateNodeName(targetNodeName, newNodeName)}
                >
                    Update Node Name
                </button>
            </div>
        </div>
    );
}

export default BinaryTree;

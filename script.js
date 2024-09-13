// Function to create a new min heap node
function createNode(data, freq) {
    return { data, freq, left: null, right: null };
}

// Function to build the Huffman Tree and show each step
function buildHuffmanTree(data, freq) {
    const nodes = [];

    // Initialize nodes from input data and frequencies
    for (let i = 0; i < data.length; i++) {
        nodes.push(createNode(data[i], freq[i]));
    }

    // Steps for Huffman Tree construction
    const steps = [];

    // Build the Huffman Tree
    while (nodes.length > 1) {
        // Sort nodes by frequency
        nodes.sort((a, b) => a.freq - b.freq);

        // Extract two nodes with the lowest frequencies
        const left = nodes.shift();
        const right = nodes.shift();

        // Create a new internal node with these two nodes as children
        const newNode = createNode('$', left.freq + right.freq);
        newNode.left = left;
        newNode.right = right;

        // Add the new node to the nodes list
        nodes.push(newNode);

        // Record the step
        steps.push(JSON.parse(JSON.stringify(nodes))); // Clone to keep snapshots
    }

    // The root of the tree is the only remaining node
    return { root: nodes[0], steps };
}

// Function to display Huffman codes
function displayHuffmanCodes(node, code, result) {
    if (!node) return;

    // If it's a leaf node, display its code
    if (!node.left && !node.right) {
        result.push(`${node.data}: ${code.join('')}`);
        return;
    }

    // Traverse left
    code.push(0);
    displayHuffmanCodes(node.left, code, result);
    code.pop();

    // Traverse right
    code.push(1);
    displayHuffmanCodes(node.right, code, result);
    code.pop();
}

// Function to display each step of Huffman Tree construction
function displayTreeSteps(steps) {
    const treeElement = document.getElementById('huffmanTree');
    treeElement.innerHTML = ''; // Clear existing content

    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.style.marginBottom = '20px';
        stepDiv.innerHTML = `<strong>Step ${index + 1}:</strong>`;
        step.forEach(node => {
            stepDiv.appendChild(drawNode(node)); // Draw each node in the step
        });
        treeElement.appendChild(stepDiv);
    });
}

// Helper function to create a visual representation of a node
function drawNode(node) {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'node';
    nodeDiv.innerHTML = node.data === '$' ? node.freq : node.data + ' (' + node.freq + ')';

    // Recursively draw child nodes if they exist
    if (node.left || node.right) {
        const childrenDiv = document.createElement('div');
        childrenDiv.className = 'children';

        if (node.left) {
            const leftChild = drawNode(node.left);
            childrenDiv.appendChild(leftChild);
        }
        if (node.right) {
            const rightChild = drawNode(node.right);
            childrenDiv.appendChild(rightChild);
        }
        nodeDiv.appendChild(childrenDiv);
    }
    return nodeDiv;
}

// Function to generate Huffman Codes
function generateHuffmanCodes() {
    const input = document.getElementById('inputText').value.trim();
    if (!input) {
        alert('Please enter some text');
        return;
    }

    const freqMap = {};
    for (let char of input) {
        freqMap[char] = (freqMap[char] || 0) + 1;
    }

    const data = Object.keys(freqMap);
    const freq = Object.values(freqMap);

    const { root, steps } = buildHuffmanTree(data, freq);

    // Display each step of the Huffman Tree construction
    displayTreeSteps(steps);

    // Display Huffman Codes
    const result = [];
    displayHuffmanCodes(root, [], result);
    document.getElementById('huffmanCodes').innerHTML = result.join('<br>');
}

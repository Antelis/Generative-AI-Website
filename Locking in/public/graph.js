var nodes = null;
var edges = null;
var network = null;

function draw() {
  var container = document.getElementById("mynetwork");

  fetch('/database') // Fetch data from the PostgreSQL database
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      throw new Error('Request failed');
    })
    .then(csvData => {
      const dataRows = csvData.split('\n');
      const headers = dataRows[0].split(',').map(header => header.trim());
  nodes = dataRows.slice(0).map((row, index) => {
      const values = row.split(',');
      const node = {};
      // Assigning properties based on CSV columns
      node.label = values[0].trim(); // Tool Name
      node.toolName = node.label;
      node.referenceURL = values[1].trim(); // Reference URL
      node.ecosystemLayer = values[2] ? values[2].trim() : ''; // Generative AI Ecosystem Layer
      // Generative AI Ecosystem Layer
      node.ecosystemLayer = values[3] ? values[3].trim() : ''; // Generative AI Ecosystem Layer
      // Content Type
      node.ecosystemLayer = values[4] ? values[4].trim() : ''; // Generative AI Ecosystem Layer
      // Primary Enterprise Category
      node.ecosystemLayer = values[5] ? values[5].trim() : ''; // Generative AI Ecosystem Layer
      // Complimentary Enterprise Category
      node.ecosystemLayer = values[6] ? values[6].trim() : ''; // Generative AI Ecosystem Layer
      // Free Version Option
      node.ecosystemLayer = values[7] ? values[7].trim() : ''; // Generative AI Ecosystem Layer
      // Paid Version Option
      node.ecosystemLayer = values[8] ? values[8].trim() : ''; // Generative AI Ecosystem Layer
      // Licensing Type
      node.toolDescription = values.slice(9).join(',').trim(); // Tool Description
      // Check if the description starts and ends with double quotes
      if (node.toolDescription.startsWith('"') && node.toolDescription.endsWith('"')) {
          // Remove the enclosing double quotes
          node.toolDescription = node.toolDescription.slice(1, -1);
      }
      node.shape = 'circularImage';
      node.image = 'https://cdn.wizeline.com/uploads/2023/01/Logo-1200.png';
      node.id = index + 1;
      node.group = (index % 4) + 1;
      node.size = 25;
      return node;
  });

    
    
    

      // Create nodes and connect random pairs
      const edgesData = [];
      const connectedPairs = new Set();
      while (connectedPairs.size < nodes.length) {
        const from = Math.floor(Math.random() * nodes.length);
        const to = Math.floor(Math.random() * nodes.length);
        if (from !== to && !connectedPairs.has(`${from},${to}`) && !connectedPairs.has(`${to},${from}`)) {
          edgesData.push({ from: from + 1, to: to + 1, color: { color: 'black' } }); // Set edge color to black
          connectedPairs.add(`${from},${to}`);
          connectedPairs.add(`${to},${from}`);
        }
      }

      // Construct the data object for vis.js
      const data = {
        nodes: nodes,
        edges: edgesData
      };

      const options = {
        nodes: {
          borderWidth: 4,
          size: 30,
          color: {
            border: "#222222",
            background: "#666666",
          },
          font: { color: "#000000" },
        },
        edges: {
          color: "#002385", // Set the color of all edges to black
        },
        physics: {
          enabled: true,
          stabilization: {
            enabled: true,
            iterations: 10000000,
          },
        },
      };

      network = new vis.Network(container, data, options);

      // Add event listeners after the network is created
      addNetworkEventListeners();
      createOverlayButtons();
    })
    .catch(error => {
      console.error('Error getting CSV data:', error);
    });
}


// Function to show modal with node information
function showModal(imageSrc, titleContent, textContent, url) {
  if (imageSrc.trim() === '') {
    imageSrc = 'https://pbs.twimg.com/media/GK-94b6XsAA1aR-.jpg:large'; // Replace this with your actual default image URL
  }
  // Create a div for the overlay
  var overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999";

  // Create a square container for the content
  var contentContainer = document.createElement("div");
  contentContainer.style.position = "absolute";
  contentContainer.style.top = "50%";
  contentContainer.style.left = "50%";
  contentContainer.style.transform = "translate(-50%, -50%)";
  contentContainer.style.width = "80%";
  contentContainer.style.height = "60%";
  contentContainer.style.display = "flex";
  contentContainer.style.backgroundColor = "#fff";
  contentContainer.style.padding = "20px";
  contentContainer.style.borderRadius = "10px";
  contentContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
  contentContainer.style.zIndex = "10000";

  // Create an image container
  var imageContainer = document.createElement("div");
  imageContainer.style.width = "40%";
  imageContainer.style.marginRight = "20px";

  var img = document.createElement("img");
  img.style.width = "100%";
  img.style.borderRadius = "5px";

  if (imageSrc.trim() !== '') {
    img.src = imageSrc;
  } else {
    img.src = '';
  }

  imageContainer.appendChild(img);

  // Create a div for the right half of the content container
  var rightContainer = document.createElement("div");
  rightContainer.style.width = "60%";
  rightContainer.style.display = "flex";
  rightContainer.style.flexDirection = "column";
  rightContainer.style.justifyContent = "center";

  // Create a title div with underlined text
  var titleDiv = document.createElement("div");
  titleDiv.textContent = titleContent;
  titleDiv.style.fontFamily = "Arial, sans-serif";
  titleDiv.style.fontSize = "50px";
  titleDiv.style.fontWeight = "bold";
  titleDiv.style.color = "#333";
  titleDiv.style.marginBottom = "10px";
  titleDiv.style.textAlign = "center";
  titleDiv.style.position = "sticky";
  titleDiv.style.top = "0";
  titleDiv.style.textDecoration = "underline";
  titleDiv.style.cursor = "pointer";

  // Open URL in a new window when title is clicked
  titleDiv.onclick = function() {
      window.open(url, "_blank");
  };

  // Append title to the right half of the content container
  rightContainer.appendChild(titleDiv);

  // Create a description paragraph
  var descriptionPara = document.createElement("p");
  descriptionPara.textContent = textContent.Description;
  descriptionPara.style.fontFamily = "Arial, sans-serif";
  descriptionPara.style.fontSize = "16px";
  descriptionPara.style.color = "#666";
  descriptionPara.style.marginBottom = "10px";
  descriptionPara.style.textAlign = "left";

  // Append description paragraph to the right half of the content container
  rightContainer.appendChild(descriptionPara);

  // Create a div for the attributes
  var attributesDiv = document.createElement("div");
  attributesDiv.style.fontFamily = "Arial, sans-serif";
  attributesDiv.style.fontSize = "16px";
  attributesDiv.style.color = "#666";
  attributesDiv.style.marginBottom = "10px"; 
  attributesDiv.style.textAlign = "left";

  // Populate attributes div with bullet points for attributes
  var ul = document.createElement("ul");
  ul.style.listStylePosition = "inside"; 
  ul.style.paddingLeft = "235px";
  for (var attribute in textContent) {
      if (attribute !== "Description") {
          var li = document.createElement("li");
          li.textContent = attribute + ": " + textContent[attribute];
          ul.appendChild(li);
      }
  }
  attributesDiv.appendChild(ul);

  // Append attributes div to the right half of the content container
  rightContainer.appendChild(attributesDiv);

  // Create a close button
  var closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.fontSize = "20px";
  closeButton.style.color = "#333";
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.border = "none";
  closeButton.style.cursor = "pointer";
  closeButton.style.zIndex = "10001";

  // Append close button to the content container
  contentContainer.appendChild(closeButton);

  // Append elements to the content container
  contentContainer.appendChild(imageContainer);
  contentContainer.appendChild(rightContainer);

  // Append elements to the overlay
  overlay.appendChild(contentContainer);

  // Append the overlay to the network container
  var networkContainer = document.getElementById("mynetwork");
  networkContainer.appendChild(overlay);

  // Close the overlay when clicked outside the content or on the close button
  overlay.onclick = function(event) {
      if (
          event.target === overlay ||
          event.target === closeButton
      ) {
          networkContainer.removeChild(overlay);
      }
  };
}

// Function to add network event listeners
function addNetworkEventListeners() {
  network.on('click', function(params) {
    console.log('Node clicked:', params.nodes[0]); // Example: Log the clicked node ID
  });
  // Check if the network is null before adding event listeners
  if (network !== null) {
    network.on("selectNode", function (params) { // Change event to "selectNode"
      var nodeId = params.nodes[0];
      var node = nodes.find(n => n.id == nodeId); // Find the selected node
      if (node) {
        // Print all node information to the console
        console.log("Selected Node Information:");
        console.log(node);
        
        var imageSrc = node.image !== '' ? node.image : 'https://pbs.twimg.com/media/GK-94b6XsAA1aR-.jpg:large'; // Set a default image if imageSrc is empty
        var titleContent = node['toolName']; // Check if it should be 'toolName' instead of 'Tool Name'
        var url = node['referenceURL']; // Check if it should be 'referenceURL' instead of 'Reference URL'
        var textContent = {
          "Description" : node['toolDescription'],
          "Content Type": node['contentType'], // Check if it should be 'contentType' instead of 'Content Type'
          "Licensing Type": node['licensingType'], // Check if it should be 'licensingType' instead of 'Licensing Type'
          "Ecosystem Layer": node['ecosystemLayer'], // Check if it should be 'ecosystemLayer' instead of 'Generative AI Ecosystem Layer'
          "Category": node['primaryCategory'] // Check if it should be 'primaryCategory' instead of 'Primary Enterprise Category'
        };
        
        showModal(imageSrc, titleContent, textContent, url); // Call showModal with the correct parameters
      } else {
        console.error('Selected node not found.');
      }
    });
  } else {
    console.error('Network is null.');
  }
}



function createOverlayButtons() {
  var container = document.getElementById("mynetwork");
  var buttonContainer = document.createElement("div");
  buttonContainer.style.position = "absolute";
  buttonContainer.style.top = "30%";
  buttonContainer.style.left = "10px";
  buttonContainer.style.zIndex = "10000";

  var button1 = document.createElement("button");
  button1.textContent = "Codigo";
  button1.classList.add("overlayButton");
  button1.dataset.group = 1;

  // Add event listener for button click
  button1.addEventListener("click", function() {
      const groupToFilter = parseInt(this.dataset.group);
      filterNodes(groupToFilter);
  });

  buttonContainer.appendChild(button1);
  buttonContainer.appendChild(document.createElement("br"));

  var button2 = document.createElement("button");
  button2.textContent = "Imagen";
  button2.classList.add("overlayButton");
  button2.dataset.group = 2;

  // Add event listener for button click
  button2.addEventListener("click", function() {
      const groupToFilter = parseInt(this.dataset.group);
      filterNodes(groupToFilter);
  });

  buttonContainer.appendChild(button2);
  buttonContainer.appendChild(document.createElement("br"));

  var button3 = document.createElement("button");
  button3.textContent = "Audio";
  button3.classList.add("overlayButton");
  button3.dataset.group = 3;

  // Add event listener for button click
  button3.addEventListener("click", function() {
      const groupToFilter = parseInt(this.dataset.group);
      filterNodes(groupToFilter);
  });

  buttonContainer.appendChild(button3);
  buttonContainer.appendChild(document.createElement("br"));

  var button4 = document.createElement("button");
  button4.textContent = "Texto";
  button4.classList.add("overlayButton");
  button4.dataset.group = 4;

  // Add event listener for button click
  button4.addEventListener("click", function() {
      const groupToFilter = parseInt(this.dataset.group);
      filterNodes(groupToFilter);
  });

  buttonContainer.appendChild(button4);
  buttonContainer.appendChild(document.createElement("br"));
  
  // Add reset button
  var resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.id = "resetButton"; 
  resetButton.classList.add("overlayButton");
  resetButton.addEventListener("click", function() {
    if (network === null || nodes === null) {
      console.error('Network or nodes data is not available.');
      return;
    }

    console.log('Nodes before resetting sizes:', nodes); // Log nodes before resetting sizes

    // Reset node sizes
    nodes.forEach(node => {
      node.size = 25; // Set default node size
    });

    console.log('Nodes after resetting sizes:', nodes); // Log nodes after resetting sizes

    // Update the network to reflect the changes in node sizes
    const updatedData = {
      nodes: nodes,
      edges: network.body.data.edges // Retain existing edges data
    };
    network.setData(updatedData); // Set updated data to the network
  });
  buttonContainer.appendChild(resetButton);
  buttonContainer.appendChild(document.createElement("br"));

  // Add add node button below reset button
  var addNodeButton = document.createElement("button");
  addNodeButton.textContent = "Add Node";
  addNodeButton.id = "addNodeButton"; 
  addNodeButton.classList.add("overlayButton");
  addNodeButton.addEventListener("click", function() {
      showAddNodePopup();
  });
  buttonContainer.appendChild(addNodeButton);
  container.appendChild(buttonContainer); 
  buttonContainer.appendChild(document.createElement("br"));

    // Add add node button below reset button
    var updateNode = document.createElement("button");
    updateNode.textContent = "Update Node";
    updateNode.id = "updateNodeButton"; 
    updateNode.classList.add("overlayButton");
    updateNode.addEventListener("click", function() {
        showUpdateNodePopup();
    });
    buttonContainer.appendChild(updateNode);
    container.appendChild(buttonContainer); 
    buttonContainer.appendChild(document.createElement("br"));

    var deleteNode = document.createElement("button");
    deleteNode.textContent = "Delete Node";
    deleteNode.id = "deleteNodeButton"; 
    deleteNode.classList.add("overlayButton");
    deleteNode.addEventListener("click", function() {
      showDeleteNodePopup();
    });
    buttonContainer.appendChild(deleteNode);
    container.appendChild(buttonContainer); 
    buttonContainer.appendChild(document.createElement("br"));
}



function filterNodes(groupToFilter) {
  if (network === null || nodes === null) {
    console.error('Network or nodes data is not available.');
    return;
  }

  console.log('Nodes before filtering:', nodes); // Log nodes before filtering

  // Adjust sizes based on the group
  nodes.forEach(node => {
    if (node.group === groupToFilter) {
      node.size = 60; // Increase size for nodes in the filtered group
    } else {
      node.size = 30; // Reset size for nodes not in the filtered group
    }
  });

  console.log('Nodes after filtering:', nodes); // Log nodes after filtering

  // Update the network to reflect the changes in node sizes
  const updatedData = {
    nodes: nodes,
    edges: network.body.data.edges // Retain existing edges data
  };
  network.setData(updatedData); // Set updated data to the network
}

function showAddNodePopup() {
  var container = document.getElementById("mynetwork");

  var popupContainer = document.createElement("div");
  popupContainer.style.position = "fixed";
  popupContainer.style.top = "50%";
  popupContainer.style.left = "50%";
  popupContainer.style.transform = "translate(-50%, -50%)";
  popupContainer.style.backgroundColor = "#fff";
  popupContainer.style.color = "#000000";
  popupContainer.style.padding = "20px";
  popupContainer.style.borderRadius = "10px";
  popupContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
  popupContainer.style.zIndex = "10000";

  // Create input fields for node properties
  var nameLabel = document.createElement("label");
  nameLabel.textContent = "Name:";
  var nameInput = document.createElement("input");
  nameInput.type = "text";

  var descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Description:";
  var descriptionInput = document.createElement("textarea");

  var addButton = document.createElement("button");
  addButton.textContent = "Add";

  addButton.addEventListener("click", function() {
    // Get the input values
    var name = nameInput.value;
    var description = descriptionInput.value;

// Send a POST request to add the node to the database
// Send a POST request to add the node to the database
fetch('/database', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    toolName: name,
    toolDescription: description,
    // Add other properties as needed
    referenceURL: "",
    shape: "circularImage",
    size: 25
  }),
})
.then(response => {
  if (response.ok) {
    console.log('Node added successfully to the database');
    // Optionally, you can close the popup or update the UI here
  } else {
    console.error('Error adding node to the database');
  }
})
.catch(error => {
  console.error('Error adding node to the database:', error);
});


  });

  var closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.classList.add("close");

  closeButton.addEventListener("click", function() {
    container.removeChild(popupContainer);
  });

  popupContainer.appendChild(closeButton);
  popupContainer.appendChild(nameLabel);
  popupContainer.appendChild(nameInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(descriptionLabel);
  popupContainer.appendChild(descriptionInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(addButton);

  container.appendChild(popupContainer);
}

function showUpdateNodePopup() {
  var container = document.getElementById("mynetwork");

  var popupContainer = document.createElement("div");
  popupContainer.style.position = "fixed";
  popupContainer.style.top = "50%";
  popupContainer.style.left = "50%";
  popupContainer.style.transform = "translate(-50%, -50%)";
  popupContainer.style.backgroundColor = "#fff";
  popupContainer.style.color = "#000000";
  popupContainer.style.padding = "20px";
  popupContainer.style.borderRadius = "10px";
  popupContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
  popupContainer.style.zIndex = "10000";

  var idLabel = document.createElement("label");
  idLabel.textContent = "Node ID:";
  var idInput = document.createElement("input");
  idInput.type = "text";

  var descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "New Description:";
  var descriptionInput = document.createElement("textarea");

  var updateButton = document.createElement("button");
  updateButton.textContent = "Update";

  updateButton.addEventListener("click", function() {
    var id = idInput.value;
    var description = descriptionInput.value;

    console.log('Sending PUT request to update node description');
    console.log('Node ID:', id);
    console.log('New Description:', description);

    fetch('/updateNode', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodeId: id,
        newDescription: description,
      }),
    })
      .then(response => {
        if (response.ok) {
          console.log('Node description updated successfully');
          // Optionally, you can close the popup or update the UI here
        } else {
          console.error('Error updating node description');
        }
      })
      .catch(error => {
        console.error('Error updating node description:', error);
      });
  });

  var closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.classList.add("close");

  closeButton.addEventListener("click", function() {
    container.removeChild(popupContainer);
  });

  popupContainer.appendChild(closeButton);
  popupContainer.appendChild(idLabel);
  popupContainer.appendChild(idInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(descriptionLabel);
  popupContainer.appendChild(descriptionInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(updateButton);

  container.appendChild(popupContainer);
}
function showDeleteNodePopup() {
  var container = document.getElementById("mynetwork");

  var popupContainer = document.createElement("div");
  popupContainer.style.position = "fixed";
  popupContainer.style.top = "50%";
  popupContainer.style.left = "50%";
  popupContainer.style.transform = "translate(-50%, -50%)";
  popupContainer.style.backgroundColor = "#fff";
  popupContainer.style.color = "#000000";
  popupContainer.style.padding = "20px";
  popupContainer.style.borderRadius = "10px";
  popupContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
  popupContainer.style.zIndex = "10000";

  var idLabel = document.createElement("label");
  idLabel.textContent = "Node ID:";
  var idInput = document.createElement("input");
  idInput.type = "text";

  var nameLabel = document.createElement("label");
  nameLabel.textContent = "Node Name:";
  var nameInput = document.createElement("input");
  nameInput.type = "text";

  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", function() {
    var id = idInput.value;
    var name = nameInput.value;

    console.log('Sending DELETE request to delete node');
    console.log('Node ID:', id);
    console.log('Node Name:', name);

    // Assuming a DELETE request to delete the node by ID or name
    fetch('/deleteNode', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodeId: id,
        nodeName: name,
      }),
    })
      .then(response => {
        if (response.ok) {
          console.log('Node deleted successfully');
          // Optionally, you can close the popup or update the UI here
        } else {
          console.error('Error deleting node');
        }
      })
      .catch(error => {
        console.error('Error deleting node:', error);
      });
  });

  var closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.classList.add("close");

  closeButton.addEventListener("click", function() {
    container.removeChild(popupContainer);
  });

  popupContainer.appendChild(closeButton);
  popupContainer.appendChild(idLabel);
  popupContainer.appendChild(idInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(nameLabel);
  popupContainer.appendChild(nameInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(deleteButton);

  container.appendChild(popupContainer);
}



function searchNode() {
  var searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  console.log('Search Term:', searchTerm);

  if (searchTerm === '') {
    alert('Please enter a search term.');
    return;
  }

  var similarNodes = nodes.filter(node => node.label.toLowerCase().includes(searchTerm));
  console.log('Similar Nodes:', similarNodes);

  if (similarNodes.length > 0) {
    var nodesToKeep = [];
    similarNodes.forEach(similarNode => {
      nodesToKeep.push(similarNode);
      var connectedNodes = network.getConnectedNodes(similarNode.id);
      connectedNodes.forEach(nodeId => {
        var connectedNode = nodes.find(node => node.id === nodeId);
        if (connectedNode && !nodesToKeep.includes(connectedNode)) {
          nodesToKeep.push(connectedNode);
        }
      });
    });

    // Remove nodes that are not in nodesToKeep
    var nodesToRemove = nodes.filter(node => !nodesToKeep.includes(node));
    network.body.data.nodes.remove(nodesToRemove);

    // Update the network
    network.fit();
  } else {
    alert('No nodes found with a similar name.');
  }
}



// Call the function to create overlay buttons
createOverlayButtons();



// Call the draw function when the window loads
window.addEventListener("load", () => {
  draw();
});

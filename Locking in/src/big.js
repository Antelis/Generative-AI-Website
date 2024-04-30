function showModal(imageSrc, titleContent, textContent, url) {
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

  // Create an image element
  var img = document.createElement("img");
  img.src = imageSrc;
  img.style.width = "100%";
  img.style.borderRadius = "5px";

  // Append image to the image container
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
          event.target === closeButton ||
          event.target === descriptionPara ||
          event.target === attributesDiv
      ) {
          networkContainer.removeChild(overlay);
      }
  };
}

var DIR = "../img/indonesia/";
var nodes = null;
var edges = null;
var network = null;

// Called when the Visualization API is loaded.
function draw() {
  // create people.
  // value corresponds with the age of the person
  var nodes = [
    { id: 1, name: "Vertex AI", label: "Vertex AI", description: "", contentType: "Code", licensingType: "Proprietary", ecosystemLayer: "Cloud Services", enterprise: false, shape: "circularImage", image: "https://b1157417.smushcdn.com/1157417/wp-content/uploads/2023/06/happy-samoyed-dog-outdoors-in-summer-field-825x550.jpg?lossy=1&strip=1&webp=0", group: 3, url: "https://cloud.google.com/vertex-ai" },
    { id: 2, name: "PalM2", label: "PalM2", description: "", contentType: "Code", licensingType: "Proprietary", ecosystemLayer: "Foundation Models", enterprise: false, shape: "circularImage", image: "", group: 3, url: "https://ai.google/discover/palm2/" },
    { id: 3, name: "Codey", label: "Codey", description: "", contentType: "Code", licensingType: "Proprietary", ecosystemLayer: "Cloud Services", enterprise: false, shape: "circularImage", image: "", group: 1, url: "https://cloud.google.com/vertex-ai/docs/generative-ai/code/code-models-overview" },
    { id: 4, name: "Imagen", label: "Imagen", description: "", contentType: "Image", licensingType: "Proprietary", ecosystemLayer: "Cloud Services", enterprise: false, shape: "circularImage", image: "", group: 2, url: "https://imagen.research.google/" },
];


var edges = [
  { from: 2, to: 1, arrows: "to", label: "Developed by", dashes: false, color: { color: "#848484" }, font: { align: "middle" } },{ from: 3, to: 1, arrows: "to", label: "Representative Face of", dashes: false, color: { color: "#848484" }, font: { align: "middle" } },
  { from: 4, to: 1, arrows: "to", label: "Offers Solutions for", dashes: false, color: { color: "#848484" }, font: { align: "middle" } },
  { from: 5, to: 1, arrows: "to", label: "Platform for", dashes: false, color: { color: "#848484" }, font: { align: "middle" } },
  { from: 4, to: 3, arrows: "to", label: "Integration with", dashes: false, color: { color: "#848484" }, font: { align: "middle" } },
  { from: 6, to: 7, arrows: "to", label: "Powered by", dashes: false, color: { color: "#848484" }, font: { align: "middle" } },
];    

  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    nodes: {
      borderWidth: 4,
      size: 30,
      color: {
        border: "#222222",
        background: "#666666",
      },
      font: { color: "#000000 " },
    },
    edges: {
      color: "lightgray",
    },physics: {
      enabled: true,
      stabilization: {
       enabled: true,
        iterations: 10000000
      }
    },
  };
  network = new vis.Network(container, data, options);

  function showModal(imageSrc, titleContent, textContent, url) {
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

    // Create an image element
    var img = document.createElement("img");
    img.src = imageSrc;
    img.style.width = "100%";
    img.style.borderRadius = "5px";

    // Append image to the image container
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
            event.target === closeButton ||
            event.target === descriptionPara ||
            event.target === attributesDiv
        ) {
            networkContainer.removeChild(overlay);
        }
    };
}


network.on("click", function (params) {
  if (params.nodes.length > 0) {
      var nodeId = params.nodes[0];
      var node = nodes.find(n => n.id === nodeId);
      if (node) {
          var imageSrc = node.image;
          var titleContent = node.name;
          var url = node.url;
          var textContent = {
              "Description" : node.description,
              "Content Type": node.contentType,
              "Licensing Type": node.licensingType,
              "Ecosystem Layer": node.ecosystemLayer,
              "Enterprise": node.enterprise ? "Yes" : "No"
          };
          showModal(imageSrc, titleContent, textContent, url);
      }
  }
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText = "Click event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
      params,
      null,
      4
  );
  console.log(
      "click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
  );
});


  
  network.on("doubleClick", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpanHeading").innerText = "doubleClick event:";
    document.getElementById("eventSpanContent").innerText = JSON.stringify(
      params,
      null,
      4
    );
  });

  network.on("oncontext", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpanHeading").innerText =
      "oncontext (right click) event:";
    document.getElementById("eventSpanContent").innerText = JSON.stringify(
      params,
      null,
      4
    );
  });
  network.on("dragStart", function (params) {
    // There's no point in displaying this event on screen, it gets immediately overwritten
    params.event = "[original event]";
    console.log("dragStart Event:", params);
    console.log(
      "dragStart event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
    );
  });
  network.on("dragging", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpanHeading").innerText = "dragging event:";
    document.getElementById("eventSpanContent").innerText = JSON.stringify(
      params,
      null,
      4
    );
  });
  network.on("dragEnd", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpanHeading").innerText = "dragEnd event:";
    document.getElementById("eventSpanContent").innerText = JSON.stringify(
      params,
      null,
      4
    );
    console.log("dragEnd Event:", params);
    console.log(
      "dragEnd event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
    );
  });
  // Event listeners for network interactions
  network.on("controlNodeDragging", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpanHeading").innerText =
      "control node dragging event:";
    document.getElementById("eventSpanContent").innerText = JSON.stringify(
      params,
      null,
      4
    );
  });

  network.on("controlNodeDragEnd", function (params) {
    params.event = "[original event]";
    document.getElementById("eventSpanHeading").innerText =
      "control node drag end event:";
    document.getElementById("eventSpanContent").innerText = JSON.stringify(
      params,
      null,
      4
    );
    console.log("controlNodeDragEnd Event:", params);
  });

  
  network.on("zoom", function (params) {
    if (params.scale < 0.7) {
      network.setOptions({
        nodes: {
          font: {
            size: 0,
          },
        },
      });
    } else {
      network.setOptions({
        nodes: {
          font: {
            size: 14,
          },
        },
      });
    }
    document.getElementById("eventSpanHeading").innerText = "zoom event:";
    document.getElementById("eventSpanContent").innerText = JSON.stringify(
      params,
      null,
      4
    );
  });
  

  network.on("showPopup", function (params) {
    document.getElementById("eventSpanHeading").innerText = "showPopup event: ";
    document.getElementById("eventSpanContent").innerText = JSON.stringify(
      params,
      null,
      4
    );
  });

  network.on("hidePopup", function () {
    console.log("hidePopup Event");
  });

  network.on("select", function (params) {
    console.log("select Event:", params);
  });

  network.on("selectNode", function (params) {
    console.log("selectNode Event:", params);
  });

  network.on("selectEdge", function (params) {
    console.log("selectEdge Event:", params);
  });

  network.on("deselectNode", function (params) {
    console.log("deselectNode Event:", params);
  });

  network.on("deselectEdge", function (params) {
    console.log("deselectEdge Event:", params);
  });

  network.on("hoverNode", function (params) {
    console.log("hoverNode Event:", params);
  });

  network.on("hoverEdge", function (params) {
    console.log("hoverEdge Event:", params);
  });

  network.on("blurNode", function (params) {
    console.log("blurNode Event:", params);
  });

  network.on("blurEdge", function (params) {
    console.log("blurEdge Event:", params);
  });

    // Add event listeners for filter buttons
  document.querySelectorAll(".filterButton").forEach(button => {
    button.addEventListener("click", function () {
        const groupToFilter = parseInt(this.dataset.group);
        filterNodes(groupToFilter);
    });
  });


  function filterNodes(groupToFilter) {
    // Reset all node sizes to their original values first
    nodes.forEach(node => {
      node.size = 25;
    });

    // Adjust sizes based on the group
    nodes.forEach(node => {
      if (node.group === groupToFilter) {
        node.size += 25;
      } else {
        node.size -= 15;
      }
    });

    network.setData({ nodes: nodes, edges: edges, physics: false });
  }



  function createOverlayButtons() {
    var container = document.getElementById("mynetwork");
    var buttonContainer = document.createElement("div");
    buttonContainer.style.position = "absolute";
    buttonContainer.style.top = "30%";
    buttonContainer.style.left = "10px";
    buttonContainer.style.zIndex = "10000";

    // Create and style each button
    for (var i = 0; i < 4; i++) {
        var button = document.createElement("button");
        button.textContent = "Group " + (i + 1);
        button.classList.add("overlayButton");
        button.dataset.group = i + 1;

        // Add event listener for button click
        button.addEventListener("click", function() {
            const groupToFilter = parseInt(this.dataset.group);
            filterNodes(groupToFilter);
        });

        buttonContainer.appendChild(button);
        buttonContainer.appendChild(document.createElement("br"));
    }

    // Add reset button
    var resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.id = "resetButton"; 
    resetButton.classList.add("overlayButton");
    resetButton.addEventListener("click", function() {
        nodes.forEach(function(node) {
            node.size = 30;
        });

        // Update the network with the original node sizes
        network.setData({ nodes: nodes, edges: edges });
    });
    buttonContainer.appendChild(resetButton);

    // Add add node button
    var addNodeButton = document.createElement("button");
    addNodeButton.textContent = "Add Node";
    addNodeButton.id = "addNodeButton"; 
    addNodeButton.classList.add("overlayButton");
    addNodeButton.addEventListener("click", function() {
        showAddNodePopup();
    });
    buttonContainer.appendChild(addNodeButton);

    container.appendChild(buttonContainer); 
}

// Function to show the add node popup
function showAddNodePopup() {
    var popupContainer = document.createElement("div");
    popupContainer.style.position = "fixed";
    popupContainer.style.top = "50%";
    popupContainer.style.left = "50%";
    popupContainer.style.transform = "translate(-50%, -50%)";
    popupContainer.style.backgroundColor = "#fff";
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

    var imageURLLabel = document.createElement("label");
    imageURLLabel.textContent = "Image URL:";
    var imageURLInput = document.createElement("input");
    imageURLInput.type = "text";

    var contentTypeLabel = document.createElement("label");
    contentTypeLabel.textContent = "Content Type:";
    var contentTypeInput = document.createElement("input");
    contentTypeInput.type = "text";

    var urlLabel = document.createElement("label");
    urlLabel.textContent = "URL:";
    var urlInput = document.createElement("input");
    urlInput.type = "text";

    var addButton = document.createElement("button");
    addButton.textContent = "Add";
    addButton.addEventListener("click", function() {
        var newNode = {
            id: nodes.length + 1,
            name: nameInput.value,
            label: nameInput.value,
            description: descriptionInput.value,
            contentType: contentTypeInput.value,
            image: imageURLInput.value,
            url: urlInput.value,
            group: 4, // You can set the group as needed
            shape: "circularImage",
        };
        nodes.push(newNode);
        network.setData({ nodes: nodes, edges: edges });
        container.removeChild(popupContainer);
    });

    var closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.fontSize = "20px";
    closeButton.style.color = "#333";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";
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

    popupContainer.appendChild(imageURLLabel);
    popupContainer.appendChild(imageURLInput);
    popupContainer.appendChild(document.createElement("br"));

    popupContainer.appendChild(contentTypeLabel);
    popupContainer.appendChild(contentTypeInput);
    popupContainer.appendChild(document.createElement("br"));

    popupContainer.appendChild(urlLabel);
    popupContainer.appendChild(urlInput);
    popupContainer.appendChild(document.createElement("br"));

    popupContainer.appendChild(addButton);

    container.appendChild(popupContainer);
}

// Call the function to create overlay buttons
createOverlayButtons();


    
}

window.addEventListener("load", () => {
  draw();
});



var nodes = null;
var edges = null;
var network = null;

function draw() {
  var container = document.getElementById("mynetwork");

  fetch('https://raw.githubusercontent.com/Antelis/Generative-AI-website/main/help.csv')
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      throw new Error('Request failed');
    })
    .then(csvData => {
      const dataRows = csvData.split('\n');
      const headers = dataRows[0].split(',').map(header => header.trim());
      nodes = dataRows.slice(1).map((row, index) => {
        const values = row.split(',');
        const node = {};
        headers.forEach((header, index) => {
          let value = values[index] ? values[index].trim() : '';
          if (header === 'Tool Description') {
            if (value.startsWith('"') && value.endsWith('"')) {
              node[header] = value.slice(1, -1); // Remove the quotes
            } else {
              let description = '';
              for (let i = index; i < values.length; i++) {
                description += values[i].trim();
                if (description.endsWith('"')) break; 
                if (i < values.length - 1) description += ', ';
              }
              node[header] = description;
              index += description.split(',').length - 1; 
            }
          } else {
            node[header] = value;
          }
        });
        node.label = node['Tool Name']; 
        node.shape = 'circularImage'; 
        //node.image = 'https://pbs.twimg.com/media/GK-94b6XsAA1aR-.jpg:large';
        node.image = 'https://cdn.wizeline.com/uploads/2023/01/Logo-1200.png';
        node.id = index + 1; // Assign a unique ID to each node
        node.group = (index % 4) + 1;
        node.size = 25; 
        return node;
      });
      

      // Create nodes and connect random pairs
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

// Function to add network event listeners
function addNetworkEventListeners() {
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
        var titleContent = node['Tool Name']; // Use the correct property name for the title
        var url = node['Reference URL']; // Use the correct property name for the URL
        var textContent = {
          "Description" : node['Tool Description'],
          "Content Type": node['Content Type'],
          "Licensing Type": node['Licensing Type'],
          "Ecosystem Layer": node['Generative AI Ecosystem Layer'],
          "Enterprise": node['Primary Enterprise Category'] ? "Yes" : "No"
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

function createOverlayButtons() {
  var buttonContainer = document.createElement("div");
  buttonContainer.classList.add("overlayButtonsContainer"); // Add a class for styling if needed
  buttonContainer.style.position = "absolute";
  buttonContainer.style.top = "30%";
  buttonContainer.style.left = "10px";
  buttonContainer.style.zIndex = "10001"; // Adjust z-index to ensure buttons stay visible

  // Create and style each button
  for (var i = 0; i < 4; i++) {
    var button = document.createElement("button");
    button.textContent = "Group " + (i + 1);
    button.classList.add("overlayButton");
    button.dataset.group = i + 1;

    // Add event listener for button click
    button.addEventListener("click", function () {
      const groupToFilter = parseInt(this.dataset.group);
      filterNodes(groupToFilter);
    });

    buttonContainer.appendChild(button);
    buttonContainer.appendChild(document.createElement("br"));
  }

  // Append the button container to the network container instead of the body
  var networkContainer = document.getElementById("mynetwork");
  networkContainer.appendChild(buttonContainer);
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
  
/* 
  // Create and style each button /*
  for (var i = 0; i < 4; i++) {
      var button = document.createElement("button");
      button.textContent = "Group " + (i + 1);
      button.classList.add("overlayButton");
      button.dataset.group = i + 1;

      // Add event listener for button click
      button.addEventListener("click", function() {
          const groupToFilter = parseInt(this.dataset.group);
          filterNodes(groupToFilter);
      });

      buttonContainer.appendChild(button);
      buttonContainer.appendChild(document.createElement("br"));
  }
*/
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

  // Add add node button
  var addNodeButton = document.createElement("button");
  addNodeButton.textContent = "Add Node";
  addNodeButton.id = "addNodeButton"; 
  addNodeButton.classList.add("overlayButton");
  addNodeButton.addEventListener("click", function() {
      showAddNodePopup();
  });
  buttonContainer.appendChild(addNodeButton);

  container.appendChild(buttonContainer); 
}

// Function to show the add node popup
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

  var imageURLLabel = document.createElement("label");
  imageURLLabel.textContent = "Image URL:";
  var imageURLInput = document.createElement("input");
  imageURLInput.type = "text";

  var contentTypeLabel = document.createElement("label");
  contentTypeLabel.textContent = "Content Type:";
  var contentTypeInput = document.createElement("input");
  contentTypeInput.type = "text";

  var urlLabel = document.createElement("label");
  urlLabel.textContent = "URL:";
  var urlInput = document.createElement("input");
  urlInput.type = "text";

  var addButton = document.createElement("button");
  addButton.textContent = "Add";
addButton.addEventListener("click", function() {
  var newNode = {
    id: nodes.length + 1,
    name: nameInput.value,
    label: nameInput.value,
    description: descriptionInput.value,
    contentType: contentTypeInput.value,
    image: imageURLInput.value,
    url: urlInput.value,
    group: 4, // You can set the group as needed
    shape: "circularImage",
    size: 25 // Set default node size
  };
  nodes.push(newNode);
  network.body.data.nodes.add(newNode); // Add the new node to the network
  container.removeChild(popupContainer); // Close the popup
});


  var closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.fontSize = "20px";
  closeButton.style.color = "#333";
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.border = "none";
  closeButton.style.cursor = "pointer";
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

  popupContainer.appendChild(imageURLLabel);
  popupContainer.appendChild(imageURLInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(contentTypeLabel);
  popupContainer.appendChild(contentTypeInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(urlLabel);
  popupContainer.appendChild(urlInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(addButton);

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

var nodes = null;
var edges = null;
var network = null;

function draw() {
  var container = document.getElementById("mynetwork");

  fetch('/database') // Fetch the CSV file from the server
  .then(response => {
      if (response.ok) {
        return response.text(); // Convert the response to text
      } else {
        throw new Error('Network response was not ok');
      }
  })
  .then(csvData => {
      // Process the CSV data here
      console.log(csvData); // For example, log the CSV data to the console
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });
}

// Function to add network event listeners
function addNetworkEventListeners() {
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
        var titleContent = node['Tool Name']; // Use the correct property name for the title
        var url = node['Reference URL']; // Use the correct property name for the URL
        var textContent = {
          "Description" : node['Tool Description'],
          "Content Type": node['Content Type'],
          "Licensing Type": node['Licensing Type'],
          "Ecosystem Layer": node['Generative AI Ecosystem Layer'],
          "Enterprise": node['Primary Enterprise Category'] ? "Yes" : "No"
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

function createOverlayButtons() {
  var buttonContainer = document.createElement("div");
  buttonContainer.classList.add("overlayButtonsContainer"); // Add a class for styling if needed
  buttonContainer.style.position = "absolute";
  buttonContainer.style.top = "30%";
  buttonContainer.style.left = "10px";
  buttonContainer.style.zIndex = "10001"; // Adjust z-index to ensure buttons stay visible

  // Create and style each button
  for (var i = 0; i < 4; i++) {
    var button = document.createElement("button");
    button.textContent = "Group " + (i + 1);
    button.classList.add("overlayButton");
    button.dataset.group = i + 1;

    // Add event listener for button click
    button.addEventListener("click", function () {
      const groupToFilter = parseInt(this.dataset.group);
      filterNodes(groupToFilter);
    });

    buttonContainer.appendChild(button);
    buttonContainer.appendChild(document.createElement("br"));
  }

  // Append the button container to the network container instead of the body
  var networkContainer = document.getElementById("mynetwork");
  networkContainer.appendChild(buttonContainer);
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
  
/* 
  // Create and style each button /*
  for (var i = 0; i < 4; i++) {
      var button = document.createElement("button");
      button.textContent = "Group " + (i + 1);
      button.classList.add("overlayButton");
      button.dataset.group = i + 1;

      // Add event listener for button click
      button.addEventListener("click", function() {
          const groupToFilter = parseInt(this.dataset.group);
          filterNodes(groupToFilter);
      });

      buttonContainer.appendChild(button);
      buttonContainer.appendChild(document.createElement("br"));
  }
*/
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

  // Add add node button
  var addNodeButton = document.createElement("button");
  addNodeButton.textContent = "Add Node";
  addNodeButton.id = "addNodeButton"; 
  addNodeButton.classList.add("overlayButton");
  addNodeButton.addEventListener("click", function() {
      showAddNodePopup();
  });
  buttonContainer.appendChild(addNodeButton);

  container.appendChild(buttonContainer); 
}

// Function to show the add node popup
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

  var imageURLLabel = document.createElement("label");
  imageURLLabel.textContent = "Image URL:";
  var imageURLInput = document.createElement("input");
  imageURLInput.type = "text";

  var contentTypeLabel = document.createElement("label");
  contentTypeLabel.textContent = "Content Type:";
  var contentTypeInput = document.createElement("input");
  contentTypeInput.type = "text";

  var urlLabel = document.createElement("label");
  urlLabel.textContent = "URL:";
  var urlInput = document.createElement("input");
  urlInput.type = "text";

  var addButton = document.createElement("button");
  addButton.textContent = "Add";
addButton.addEventListener("click", function() {
  var newNode = {
    id: nodes.length + 1,
    name: nameInput.value,
    label: nameInput.value,
    description: descriptionInput.value,
    contentType: contentTypeInput.value,
    image: imageURLInput.value,
    url: urlInput.value,
    group: 4, // You can set the group as needed
    shape: "circularImage",
    size: 25 // Set default node size
  };
  nodes.push(newNode);
  network.body.data.nodes.add(newNode); // Add the new node to the network
  container.removeChild(popupContainer); // Close the popup
});


  var closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.fontSize = "20px";
  closeButton.style.color = "#333";
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.border = "none";
  closeButton.style.cursor = "pointer";
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

  popupContainer.appendChild(imageURLLabel);
  popupContainer.appendChild(imageURLInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(contentTypeLabel);
  popupContainer.appendChild(contentTypeInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(urlLabel);
  popupContainer.appendChild(urlInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(addButton);

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

var nodes = null;
var edges = null;
var network = null;
// Sample similarity function (adjust based on your data)


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
      nodes = dataRows.map((row, index) => {
        const values = row.split(',');
        const node = {};
        // Assigning properties based on CSV columns
        node.label = values[0].trim(); // Tool Name
        node.toolName = node.label;
        node.referenceURL = values[1].trim(); // Reference URL
        node.ecosystemLayer = values[2] ? values[2].trim() : ''; // Generative AI Ecosystem Layer
        node.contentType = values[3] ? values[3].trim().toLowerCase() : ''; // Content Type (converted to lowercase)
        node.primaryEnterpriseCategory = values[4] ? values[4].trim() : ''; // Primary Enterprise Category
        node.complimentaryEnterpriseCategory = values[5] ? values[5].trim() : ''; // Complimentary Enterprise Category
        node.freeVersionOption = values[6] ? values[6].trim() : ''; // Free Version Option
        node.paidVersionOption = values[7] ? values[7].trim() : ''; // Paid Version Option
        node.licensingType = values[8] ? values[8].trim() : ''; // Licensing Type
        node.toolDescription = values[9] ? values[9].trim() : ''; // Tool Description
        // Truncate description if it's too long
        const maxLength = 500; // Set the maximum length for the description
        // Extract the description from the CSV data
        let description = values.slice(9).join(',').trim();
        // Check if the description starts and ends with double quotes
        if (description.startsWith('"') && description.endsWith('"')) {
            // Remove the enclosing double quotes
            description = description.slice(1, -1);
        }
        // Remove the last two characters from the description
        description = description.slice(0, -2 );
        // Truncate the description if it exceeds the maximum length
        node.toolDescription = description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
        
        node.shape = 'circularImage';
        node.image = 'https://cdn.wizeline.com/uploads/2023/01/Logo-1200.png';
        node.id = parseInt(values[10]); // ID
        if (isNaN(node.id)) {
            // Generate a unique ID if the ID is not a number or missing
            node.id = index + 1;
        }
        // Assign group based on content type
        switch (node.contentType) {
            case 'code':
                node.group = 1;
                break;
            case 'text':
                node.group = 2;
                break;
            case 'image':
                node.group = 3;
                break;
            default:
                node.group = 4;
                break;
        }
        node.size = 25;
        return node;
    });
    
    

    
    

      // Create nodes and connect random pairs
      // Create edges based on similarity in name, URL, and content type
const edgesData = [];
const lastIndex = nodes.length - 1;

nodes.forEach((node1, index1) => {
  let maxSimilarity = 0;
  let mostSimilarNodeIndex = -1;
  
  // Compare node1 with all other nodes to find the most similar node
  nodes.forEach((node2, index2) => {
    if (index1 !== index2) {
      const nameSimilarity = similarity(node1.label, node2.label);
      const urlSimilarity = similarity(node1.referenceURL, node2.referenceURL);
      const contentTypeSimilarity = node1.contentType === node2.contentType ? 1 : 0;
      
      // Calculate total similarity as a weighted sum
      const totalSimilarity = 0.4 * nameSimilarity + 0.4 * urlSimilarity + 0.2 * contentTypeSimilarity;
      
      if (totalSimilarity > maxSimilarity) {
        maxSimilarity = totalSimilarity;
        mostSimilarNodeIndex = index2;
      }
    }
  });
  
  // Connect node1 to the most similar node found, or to the last node if no match is found
  const toNodeIndex = mostSimilarNodeIndex !== -1 ? mostSimilarNodeIndex : lastIndex;
  edgesData.push({ from: index1 + 1, to: toNodeIndex + 1, color: { color: 'black' } }); // Set edge color to black
});

// Helper function to calculate similarity between two strings (using Levenshtein distance)
function similarity(s1, s2) {
  const maxLength = Math.max(s1.length, s2.length);
  const distance = levenshteinDistance(s1, s2);
  return 1 - distance / maxLength;
}

// Function to calculate Levenshtein distance between two strings
function levenshteinDistance(s1, s2) {
  const dp = Array.from(Array(s1.length + 1), () => Array(s2.length + 1).fill(0));

  for (let i = 0; i <= s1.length; i++) {
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + (s1[i - 1] !== s2[j - 1] ? 1 : 0),
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1
        );
      }
    }
  }

  return dp[s1.length][s2.length];
}


      // Construct the data object for vis.js
      const data = {
        nodes: nodes,
        edges: edgesData
      };

      const options = {
        nodes: {
          borderWidth: 2,
          size: 20,
          color: {
            border: "#444",
            background: "#888",
          },
          font: { color: "#333", size: 14 },
        },
        edges: {
          color: { color: "#007bff", opacity: 0.5 },
          smooth: { type: "continuous" },
        },
        physics: {
          enabled: true,
          stabilization: {
            iterations: 1000, // Increase stabilization iterations
            fit: false, // Disable fitting after stabilization
          },
        },
        interaction: {
          hover: true,
        },
        // Set initial zoom level and position
      };
      
      

      network = new vis.Network(container, data, options);

      // Add event listeners after the network is created
      addNetworkEventListeners();
      createOverlayButtons();
      createsearchoverlay();
      createadminoverlay();
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
  contentContainer.style.top = "60%";
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

  // Set the source and class for the image
  img.src = imageSrc;
  img.classList.add("modal-image"); // Add a class for styling

  // Add CSS styles to limit the size of the image
  img.style.maxWidth = "100%";
  img.style.maxHeight = "100%";
  img.style.objectFit = "contain"; // Maintain aspect ratio

  // Append the image to its container
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
          "Ecosystem Layer": node['ecosystemLayer'], // Check if it should be 'licensingType' instead of 'Licensing Type'
          "Enterprise Category": node['primaryEnterpriseCategory'], // Check if it should be 'ecosystemLayer' instead of 'Generative AI Ecosystem Layer'
          "Licensing": node['licensingType']
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

function createsearchoverlay() {
  var container = document.getElementById("mynetwork");
  var searchOverlay = document.createElement("div");
  searchOverlay.style.position = "absolute";
  searchOverlay.style.top = "100px";
  searchOverlay.style.left = "50%";
  searchOverlay.style.transform = "translateX(-75%)";
  searchOverlay.style.zIndex = "10000";

  // Create search input
  var searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search...";
  searchInput.id = "searchInput";
  searchInput.style.width = "400px"; // Adjust width as needed
    // Add event listener for search input
    searchInput.addEventListener("input", function() {
      searchNode();
    });

  searchOverlay.appendChild(searchInput);
  container.appendChild(searchOverlay);
}


function createOverlayButtons() {
  var container = document.getElementById("mynetwork");
  var buttonContainer = document.createElement("div");
  buttonContainer.style.position = "absolute";
  buttonContainer.style.top = "30%";
  buttonContainer.style.left = "10px";
  buttonContainer.style.zIndex = "10000";

  function createButton(imgSrc, group, bgColor) {
    var button = document.createElement("button");
    var img = document.createElement("img");
    img.src = imgSrc;
    img.classList.add("overlayButtonImg");
    img.style.width = "30px"; // Adjust the width as needed
    img.style.height = "30px"; // Adjust the height as needed
    button.appendChild(img);
    button.dataset.group = group;
    button.style.backgroundColor = bgColor;
    button.style.borderRadius = "50%"; // Make the button round
    button.style.width = "50px"; // Adjust the width as needed
    button.style.height = "50px"; // Adjust the height as needed

    // Add event listener for button click
    button.addEventListener("click", function() {
      const groupToFilter = parseInt(this.dataset.group);
      filterNodes(groupToFilter);
    });

    return button;
  }

  var button1 = createButton(
    "https://t3.ftcdn.net/jpg/01/58/34/10/360_F_158341076_1UVkU7KFK3f7yiTcuJswvZsqxQFPNv6F.jpg",
    1,
    "blue"
  );
  buttonContainer.appendChild(button1);
  buttonContainer.appendChild(document.createElement("br"));

  var button2 = createButton("https://t3.ftcdn.net/jpg/01/58/34/10/360_F_158341076_1UVkU7KFK3f7yiTcuJswvZsqxQFPNv6F.jpg", 2, "yellow"); // Replace "path_to_image2.jpg" with the actual image path
  buttonContainer.appendChild(button2);
  buttonContainer.appendChild(document.createElement("br"));

  var button3 = createButton(
    "https://t3.ftcdn.net/jpg/01/58/34/10/360_F_158341076_1UVkU7KFK3f7yiTcuJswvZsqxQFPNv6F.jpg",
    3,
    "red"
  );
  buttonContainer.appendChild(button3);
  buttonContainer.appendChild(document.createElement("br"));

  var button4 = createButton(
    "https://t3.ftcdn.net/jpg/01/58/34/10/360_F_158341076_1UVkU7KFK3f7yiTcuJswvZsqxQFPNv6F.jpg",
    4,
    "green"
  );
  buttonContainer.appendChild(button4);
  buttonContainer.appendChild(document.createElement("br"));

  container.appendChild(buttonContainer);

  // Add Add Request button
  var addRequestButton = document.createElement("button");
  addRequestButton.textContent = "Add Request";
  addRequestButton.style.backgroundColor = "blue"; // Adjust color as needed
  addRequestButton.style.width = "80px"; // Adjust width as needed
  addRequestButton.style.height = "50px"; // Adjust height as needed
  addRequestButton.style.color = "white";
  addRequestButton.style.borderRadius = "10px"; // Make the button slightly rounded
  addRequestButton.addEventListener("click", function() {
    showAddRequestPopup();
  });
  buttonContainer.appendChild(addRequestButton);
  buttonContainer.appendChild(document.createElement("br"));

  // Add reset button
  var resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.id = "resetButton";
  resetButton.style.backgroundColor = "green"; // Adjust color as needed
  resetButton.style.width = "80px"; // Adjust width as needed
  resetButton.style.height = "30px"; // Adjust height as needed
  resetButton.style.color = "white";
  resetButton.style.borderRadius = "10px"; // Make the button slightly rounded
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

  container.appendChild(buttonContainer);
}

function showAddRequestPopup() {
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

  // Create input fields for request properties
  var nameLabel = document.createElement("label");
  nameLabel.textContent = "Name:";
  var nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.required = true; // Make the name input required

  var urlLabel = document.createElement("label");
  urlLabel.textContent = "URL:";
  var urlInput = document.createElement("input");
  urlInput.type = "text";

  var contentTypeLabel = document.createElement("label");
  contentTypeLabel.textContent = "Content Type:";
  var contentTypeInput = document.createElement("input");
  contentTypeInput.type = "text";

  var descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Description:";
  var descriptionInput = document.createElement("textarea");

  var addButton = document.createElement("button");
  addButton.textContent = "Add Request";

  addButton.addEventListener("click", function () {
    // Get the input values
    var name = nameInput.value;
    var url = urlInput.value;
    var contentType = contentTypeInput.value;
    var description = descriptionInput.value;

    // Send a POST request to add the request to the "requests" table
    fetch('/addRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        url: url,
        contentType: contentType,
        description: description
      }),
    })
      .then(response => {
        if (response.ok) {
          console.log('Request added successfully to the "requests" table');
          // Optionally, you can close the popup or update the UI here
        } else {
          console.error('Error adding request to the "requests" table');
        }
      })
      .catch(error => {
        console.error('Error adding request to the "requests" table:', error);
      });
  });

  var closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.classList.add("close");

  closeButton.addEventListener("click", function() {
    container.removeChild(popupContainer);
  });

  popupContainer.appendChild(closeButton);
  // Append input fields and button to the popup container
  popupContainer.appendChild(nameLabel);
  popupContainer.appendChild(nameInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(urlLabel);
  popupContainer.appendChild(urlInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(contentTypeLabel);
  popupContainer.appendChild(contentTypeInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(descriptionLabel);
  popupContainer.appendChild(descriptionInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(addButton);

  container.appendChild(popupContainer);
}

function createadminoverlay() {
  var container = document.getElementById("mynetwork");
  var buttonContainer = document.createElement("div");
  buttonContainer.style.position = "absolute";
  buttonContainer.style.top = "13%";
  buttonContainer.style.right = "10px";
  buttonContainer.style.zIndex = "10000";

  // Add hamburger menu
  var hamburgerMenu = document.createElement("div");
  hamburgerMenu.classList.add("hamburger-menu");

  // Add menu icon
  var menuIcon = document.createElement("div");
  menuIcon.classList.add("menu-icon");
  menuIcon.addEventListener("click", function() {
    hamburgerMenu.classList.toggle("active");
  });
  hamburgerMenu.appendChild(menuIcon);

  // Add menu items
  var menuItems = document.createElement("div");
  menuItems.classList.add("menu-items");

  // Add add node button inside menu
  var addNodeButton = createButton("Add Node", showAddNodePopup);
  menuItems.appendChild(addNodeButton);

  var addNodeRequestButton = createButton("Add Node via Request", showAddNodeRequestPopup);
  menuItems.appendChild(addNodeRequestButton);

  // Add update node button inside menu
  var updateNodeButton = createButton("Update Node", showUpdateNodePopup);
  menuItems.appendChild(updateNodeButton);

  // Add delete node button inside menu
  var deleteNodeButton = createButton("Delete Node", showDeleteNodePopup);
  menuItems.appendChild(deleteNodeButton);

  hamburgerMenu.appendChild(menuItems);
  buttonContainer.appendChild(hamburgerMenu);
  buttonContainer.appendChild(document.createElement("br"));

  container.appendChild(buttonContainer);
  buttonContainer.appendChild(document.createElement("br"));
}
function showAddNodeRequestPopup() {
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
  idLabel.textContent = "Request ID:";
  var idInput = document.createElement("input");
  idInput.type = "text";

  var addButton = document.createElement("button");
  addButton.textContent = "Add";
  addButton.addEventListener("click", function() {
    var requestId = idInput.value;
  
    // Make a fetch request to retrieve request attributes based on the request ID
    fetch(`/getRequestInfo/${requestId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Extract the attributes from the retrieved data
        var { name, url, contentType, description } = data;
  
        // Make a fetch request to add the request attributes to the main database
        fetch('/addRequest2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            url: url,
            contentType: contentType,
            description: description
          }),
        })
        .then(response => {
          if (response.ok) {
            console.log('Request attributes added to the main database successfully');
            // Optionally, you can update the UI or show a success message here
          } else {
            console.error('Error adding request attributes to the main database');
          }
        })
        .catch(error => {
          console.error('Error adding request attributes to the main database:', error);
        });
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  });
  
  var previewButton = document.createElement("button");
  previewButton.textContent = "Preview";
  previewButton.addEventListener("click", function() {
    var requestId = idInput.value;
  
    // Make a fetch request to retrieve request information
    fetch(`/getRequestInfo/${requestId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Display the retrieved request information on the popup
        var popupContent = document.createElement("div");
        popupContent.classList.add("popup-info");
  
        // Create and style elements for displaying information
        var heading = document.createElement("h3");
        heading.textContent = "Request Information";
        var infoList = document.createElement("ul");
  
        // Add request attributes to the list
        var nameItem = document.createElement("li");
        nameItem.textContent = "Name: " + data.name;
        var urlItem = document.createElement("li");
        urlItem.textContent = "URL: " + data.url;
        var contentTypeItem = document.createElement("li");
        contentTypeItem.textContent = "Content Type: " + data.content_type;
        var descriptionItem = document.createElement("li");
        descriptionItem.textContent = "Description: " + data.description;
  
        // Append items to the list
        infoList.appendChild(nameItem);
        infoList.appendChild(urlItem);
        infoList.appendChild(contentTypeItem);
        infoList.appendChild(descriptionItem);
  
        // Append heading and list to the popup content
        popupContent.appendChild(heading);
        popupContent.appendChild(infoList);
  
        // Append popup content to the popup container
        popupContainer.appendChild(popupContent);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
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
  popupContainer.appendChild(addButton);
  popupContainer.appendChild(previewButton);

  container.appendChild(popupContainer);
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
  nameLabel.textContent = "Tool Name:";
  var nameInput = document.createElement("input");
  nameInput.type = "text";

  var referenceLabel = document.createElement("label");
  referenceLabel.textContent = "Reference URL:";
  var referenceInput = document.createElement("input");
  referenceInput.type = "text";

  var layerLabel = document.createElement("label");
  layerLabel.textContent = "Generative AI Ecosystem Layer:";
  var layerInput = document.createElement("input");
  layerInput.type = "text";

  var contentTypeLabel = document.createElement("label");
  contentTypeLabel.textContent = "Content Type:";
  var contentTypeInput = document.createElement("select");
  // Add options for Content Type
  var options = ["Code", "Text", "Voice & Video", "Image"];
  options.forEach(option => {
    var opt = document.createElement("option");
    opt.value = option.toLowerCase().replace(/\s/g, "_");
    opt.text = option;
    contentTypeInput.add(opt);
  });

  var primaryCategoryLabel = document.createElement("label");
  primaryCategoryLabel.textContent = "Primary Enterprise Category:";
  var primaryCategoryInput = document.createElement("input");
  primaryCategoryInput.type = "text";

  var complimentaryCategoryLabel = document.createElement("label");
  complimentaryCategoryLabel.textContent = "Complimentary Enterprise Category:";
  var complimentaryCategoryInput = document.createElement("input");
  complimentaryCategoryInput.type = "text";

  var freeVersionLabel = document.createElement("label");
  freeVersionLabel.textContent = "Free Version Option:";
  var freeVersionInput = document.createElement("input");
  freeVersionInput.type = "text";

  var paidVersionLabel = document.createElement("label");
  paidVersionLabel.textContent = "Paid Version Option:";
  var paidVersionInput = document.createElement("input");
  paidVersionInput.type = "text";

  var licensingTypeLabel = document.createElement("label");
  licensingTypeLabel.textContent = "Licensing Type:";
  var licensingTypeInput = document.createElement("input");
  licensingTypeInput.type = "text";

  var descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Tool Description:";
  var descriptionInput = document.createElement("textarea");

  var requestIdLabel = document.createElement("label");
  requestIdLabel.textContent = "Request ID:";
  var requestIdInput = document.createElement("input");
  requestIdInput.type = "text";

  var addButton = document.createElement("button");
  addButton.textContent = "Add Node";

  addButton.addEventListener("click", function () {
    // Get the input values
    var toolName = nameInput.value;
    var referenceURL = referenceInput.value;
    var layer = layerInput.value;
    var contentType = contentTypeInput.value;
    var primaryCategory = primaryCategoryInput.value;
    var complimentaryCategory = complimentaryCategoryInput.value;
    var freeVersionOption = freeVersionInput.value;
    var paidVersionOption = paidVersionInput.value;
    var licensingType = licensingTypeInput.value;
    var toolDescription = descriptionInput.value;
    var requestId = requestIdInput.value; // Get the request ID

    // Send a POST request to add the node to the database
    fetch('/database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toolName: toolName,
        referenceURL: referenceURL,
        generativeAiEcosystemLayer: layer,
        contentType: contentType,
        primaryEnterpriseCategory: primaryCategory,
        complimentaryEnterpriseCategory: complimentaryCategory,
        freeVersionOption: freeVersionOption,
        paidVersionOption: paidVersionOption,
        licensingType: licensingType,
        toolDescription: toolDescription,
        requestId: requestId, // Include the request ID in the payload
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
  // Append input fields and buttons to the popup container
  popupContainer.appendChild(nameLabel);
  popupContainer.appendChild(nameInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(referenceLabel);
  popupContainer.appendChild(referenceInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(layerLabel);
  popupContainer.appendChild(layerInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(contentTypeLabel);
  popupContainer.appendChild(contentTypeInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(primaryCategoryLabel);
  popupContainer.appendChild(primaryCategoryInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(complimentaryCategoryLabel);
  popupContainer.appendChild(complimentaryCategoryInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(freeVersionLabel);
  popupContainer.appendChild(freeVersionInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(paidVersionLabel);
  popupContainer.appendChild(paidVersionInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(licensingTypeLabel);
  popupContainer.appendChild(licensingTypeInput);
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

  // Create input fields for node properties
  var idLabel = document.createElement("label");
  idLabel.textContent = "Node ID:";
  var idInput = document.createElement("input");
  idInput.type = "text";

  var nameLabel = document.createElement("label");
  nameLabel.textContent = "Tool Name:";
  var nameInput = document.createElement("input");
  nameInput.type = "text";

  var referenceLabel = document.createElement("label");
  referenceLabel.textContent = "Reference URL:";
  var referenceInput = document.createElement("input");
  referenceInput.type = "text";

  var layerLabel = document.createElement("label");
  layerLabel.textContent = "Generative AI Ecosystem Layer:";
  var layerInput = document.createElement("input");
  layerInput.type = "text";

  var contentTypeLabel = document.createElement("label");
  contentTypeLabel.textContent = "Content Type:";
  var contentTypeInput = document.createElement("select");
  var options = ["Code", "Text", "Voice & Video", "Image"];
  options.forEach(option => {
    var opt = document.createElement("option");
    opt.value = option.toLowerCase().replace(/\s/g, "_");
    opt.text = option;
    contentTypeInput.add(opt);
  });

  // Create input fields for other properties
  var primaryCategoryLabel = document.createElement("label");
  primaryCategoryLabel.textContent = "Primary Enterprise Category:";
  var primaryCategoryInput = document.createElement("input");
  primaryCategoryInput.type = "text";

  var complimentaryCategoryLabel = document.createElement("label");
  complimentaryCategoryLabel.textContent = "Complimentary Enterprise Category:";
  var complimentaryCategoryInput = document.createElement("input");
  complimentaryCategoryInput.type = "text";

  var freeVersionLabel = document.createElement("label");
  freeVersionLabel.textContent = "Free Version Option:";
  var freeVersionInput = document.createElement("input");
  freeVersionInput.type = "text";

  var paidVersionLabel = document.createElement("label");
  paidVersionLabel.textContent = "Paid Version Option:";
  var paidVersionInput = document.createElement("input");
  paidVersionInput.type = "text";

  var licensingTypeLabel = document.createElement("label");
  licensingTypeLabel.textContent = "Licensing Type:";
  var licensingTypeInput = document.createElement("input");
  licensingTypeInput.type = "text";

  var descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Tool Description:";
  var descriptionInput = document.createElement("textarea");

  var updateButton = document.createElement("button");
  updateButton.textContent = "Update";

  updateButton.addEventListener("click", function () {
    var id = idInput.value;
    var toolName = nameInput.value;
    var referenceURL = referenceInput.value;
    var layer = layerInput.value;
    var contentType = contentTypeInput.value;
    var primaryEnterpriseCategory = primaryCategoryInput.value;
    var complimentaryEnterpriseCategory = complimentaryCategoryInput.value;
    var freeVersionOption = freeVersionInput.value;
    var paidVersionOption = paidVersionInput.value;
    var licensingType = licensingTypeInput.value;
    var description = descriptionInput.value;

    fetch('/updateNode', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodeId: id,
        toolName: toolName,
        referenceURL: referenceURL,
        generativeAiEcosystemLayer: layer,
        contentType: contentType,
        primaryEnterpriseCategory: primaryEnterpriseCategory,
        complimentaryEnterpriseCategory: complimentaryEnterpriseCategory,
        freeVersionOption: freeVersionOption,
        paidVersionOption: paidVersionOption,
        licensingType: licensingType,
        toolDescription: description,
      }),
    })
      .then(response => {
        if (response.ok) {
          console.log('Node updated successfully');
          // Optionally, you can close the popup or update the UI here
        } else {
          console.error('Error updating node');
        }
      })
      .catch(error => {
        console.error('Error updating node:', error);
      });
  });

  var closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.classList.add("close");

  closeButton.addEventListener("click", function () {
    container.removeChild(popupContainer);
  });

  popupContainer.appendChild(closeButton);
  popupContainer.appendChild(idLabel);
  popupContainer.appendChild(idInput);
  popupContainer.appendChild(document.createElement("br"));

  popupContainer.appendChild(nameLabel);
popupContainer.appendChild(nameInput);
popupContainer.appendChild(document.createElement("br"));

popupContainer.appendChild(referenceLabel);
popupContainer.appendChild(referenceInput);
popupContainer.appendChild(document.createElement("br"));

popupContainer.appendChild(layerLabel);
popupContainer.appendChild(layerInput);
popupContainer.appendChild(document.createElement("br"));

popupContainer.appendChild(contentTypeLabel);
popupContainer.appendChild(contentTypeInput);
popupContainer.appendChild(document.createElement("br"));

popupContainer.appendChild(primaryCategoryLabel);
popupContainer.appendChild(primaryCategoryInput);
popupContainer.appendChild(document.createElement("br"));

popupContainer.appendChild(complimentaryCategoryLabel);
popupContainer.appendChild(complimentaryCategoryInput);
popupContainer.appendChild(document.createElement("br"));

popupContainer.appendChild(freeVersionLabel);
popupContainer.appendChild(freeVersionInput);
popupContainer.appendChild(document.createElement("br"));

popupContainer.appendChild(paidVersionLabel);
popupContainer.appendChild(paidVersionInput);
popupContainer.appendChild(document.createElement("br"));

popupContainer.appendChild(licensingTypeLabel);
popupContainer.appendChild(licensingTypeInput);
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


  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", function() {
    var id = idInput.value;

    console.log('Sending DELETE request to delete node');
    console.log('Node ID:', id);

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


  popupContainer.appendChild(deleteButton);

  container.appendChild(popupContainer);
}

function createButton(label, onClickFunction) {
  var button = document.createElement("button");
  button.textContent = label;
  button.classList.add("overlayButton");
  button.addEventListener("click", function() {
    // Show popup on button click
    onClickFunction();
    // Disable other buttons
    disableOtherButtons(button);
    // Add dark overlay
    addDarkOverlay();
  });
  return button;
}

function disableOtherButtons(clickedButton) {
  var buttons = document.querySelectorAll(".overlayButton");
  buttons.forEach(button => {
    if (button !== clickedButton) {
      button.disabled = true;
    }
  });
}

function enableAllButtons() {
  var buttons = document.querySelectorAll(".overlayButton");
  buttons.forEach(button => {
    button.disabled = false;
  });
}

function addDarkOverlay() {
  var overlay = document.createElement("div");
  overlay.classList.add("dark-overlay");
  document.body.appendChild(overlay);

  // Close the popup and remove the dark overlay when clicking on the X button
  var closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", function() {
    var popupContainer = document.querySelector(".popup-container");
    if (popupContainer) {
      popupContainer.parentElement.removeChild(popupContainer);
    }
    document.body.removeChild(overlay);
    enableAllButtons(); // Enable all buttons when closing the popup
  });
}



function searchNode() {
  var searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  console.log('Search Term:', searchTerm);

  // Get all nodes that match the search term
  var similarNodes = nodes.filter(node => node.label.toLowerCase().includes(searchTerm));
  console.log('Similar Nodes:', similarNodes);

  if (similarNodes.length > 0) {
    var nodesToShow = [];
    similarNodes.forEach(similarNode => {
      nodesToShow.push(similarNode);
      var connectedNodes = network.getConnectedNodes(similarNode.id);
      connectedNodes.forEach(nodeId => {
        var connectedNode = nodes.find(node => node.id === nodeId);
        if (connectedNode && !nodesToShow.includes(connectedNode)) {
          nodesToShow.push(connectedNode);
        }
      });
    });

    // Show nodes that are in nodesToShow
    var nodesToHide = nodes.filter(node => !nodesToShow.includes(node));
    nodesToHide.forEach(node => {
      network.body.data.nodes.remove(node.id);
    });

    // Add missing nodes
    nodesToShow.forEach(node => {
      if (!network.body.data.nodes.get(node.id)) {
        network.body.data.nodes.add(node);
      }
    });

    // Update the network
    network.fit();
  } else {
    // If no nodes match the search term, show all nodes
    nodes.forEach(node => {
      if (!network.body.data.nodes.get(node.id)) {
        network.body.data.nodes.add(node);
      }
    });

    // Update the network
    network.fit();
  }
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

// Call the function to create overlay buttons
createOverlayButtons();
createsearchoverlay();
createadminoverlay();


// Call the draw function when the window loads
window.addEventListener("load", () => {
  draw();
});

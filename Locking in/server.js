const express = require('express');
const app = express();
const path = require('path');
const { Pool } = require('pg'); // Require the pg library for PostgreSQL
const bodyParser = require('body-parser');

// PostgreSQL database configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bdai', // Specify the database name
    password: 'pinguino04',
    port: 5432, // Default PostgreSQL port
});

// Connect to PostgreSQL database
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to PostgreSQL database!');

    // Release the client back to the pool
    release();
});

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        }
    },
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'webpage.html'));
});

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Route to fetch data from PostgreSQL
app.get('/database', (req, res) => {
    pool.query('SELECT * FROM public."ai_tools2"', (err, result) => { // Specify the schema and table name
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error executing query');
        }
        // Convert result to CSV format
        const csvData = result.rows.map(row => Object.values(row).join(',')).join('\n');
        res.header('Content-Type', 'text/csv');
        res.send(csvData);
        //console.log(csvData);
    });
});

app.post('/database', (req, res) => {
  console.log('Received data:', req.body); // Add this line for debugging

  // Extract data from req.body
  const {
      toolName,
      referenceURL,
      generativeAiEcosystemLayer,
      contentType,
      primaryEnterpriseCategory,
      freeVersionOption,
      paidVersionOption,
      licensingType,
      imageURL,
      toolDescription
  } = req.body;

  // Execute the INSERT query to add the new node to the database
  pool.query(
      `INSERT INTO public."ai_tools2" (
        "Tool Name", 
        "Reference URL", 
        "Generative Ecosystem Layer",
        "Content Type", 
        "Enterprise Category",
        "Free Version", 
        "Paid Version",
        "Licensing Type", 
        "imageURL",
        "Description"
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
          toolName,
          referenceURL,
          generativeAiEcosystemLayer,
          contentType,
          primaryEnterpriseCategory,
          freeVersionOption,
          paidVersionOption,
          licensingType,
          imageURL,
          toolDescription
      ],
      (err, result) => {
          if (err) {
              console.error('Error executing INSERT query:', err);
              return res.status(500).send('Error executing INSERT query');
          }
          console.log('New node added to PostgreSQL database!');
          res.status(200).send('New node added successfully');
      }
  );
});

// Route to update node information in the database
app.put('/updateNode', (req, res) => {
    const {
        nodeId,
        toolName,
        referenceURL,
        generativeAiEcosystemLayer,
        contentType,
        primaryEnterpriseCategory,
        freeVersionOption,
        paidVersionOption,
        licensingType,
        toolDescription
    } = req.body; // Extract data from the request body

    console.log('Received PUT request to update node information');
    console.log('Node ID:', nodeId);

    // Create an object to store the fields that need to be updated
    const updateFields = {};

    // Check each field and add it to the updateFields object if it's not empty or undefined
    if (toolName !== undefined && toolName !== '') updateFields['Tool Name'] = toolName;
    if (referenceURL !== undefined && referenceURL !== '') updateFields['Reference URL'] = referenceURL;
    if (generativeAiEcosystemLayer !== undefined && generativeAiEcosystemLayer !== '') updateFields['Generative AI Ecosystem Layer'] = generativeAiEcosystemLayer;
    if (contentType !== undefined && contentType !== '') updateFields['Content Type'] = contentType;
    if (primaryEnterpriseCategory !== undefined && primaryEnterpriseCategory !== '') updateFields['Primary Enterprise Category'] = primaryEnterpriseCategory;
    if (freeVersionOption !== undefined && freeVersionOption !== '') updateFields['Free Version Option'] = freeVersionOption;
    if (paidVersionOption !== undefined && paidVersionOption !== '') updateFields['Paid Version Option'] = paidVersionOption;
    if (licensingType !== undefined && licensingType !== '') updateFields['Licensing Type'] = licensingType;
    if (toolDescription !== undefined && toolDescription !== '') updateFields['Tool Description'] = toolDescription;

    // Check if any fields need to be updated
    if (Object.keys(updateFields).length === 0) {
        console.log('No fields provided for update, skipping...');
        return res.status(400).send('No fields provided for update');
    }

    // Generate the SET clause for the SQL UPDATE query
    const setClause = Object.keys(updateFields).map((key, index) => `"${key}" = $${index + 1}`).join(', ');

    // Generate the array of values for the SQL UPDATE query
    const values = Object.values(updateFields);

    // Execute the UPDATE query to update node information in the database
    pool.query(
        `UPDATE public."ai_tools2" 
         SET ${setClause}
         WHERE id = $${values.length + 1}`,
        [...values, nodeId],
        (err, result) => {
            if (err) {
                console.error('Error executing UPDATE query:', err);
                return res.status(500).send('Error executing UPDATE query');
            }
            console.log('Node information updated in PostgreSQL database!');
            res.status(200).send('Node information updated successfully');
        }
    );
});

// DELETE endpoint for deleting nodes request_id
app.delete('/deleteNode', (req, res) => { 
    const { nodeId, nodeName } = req.body;

    if (nodeId) {
        // Delete node by ID
        pool.query(
            `DELETE FROM public."ai_tools2" WHERE id = $1`,
            [nodeId],
            (err, result) => {
                if (err) {
                    console.error('Error executing DELETE query:', err);
                    return res.status(500).send('Error executing DELETE query');
                }
                console.log('Node deleted from PostgreSQL database by ID');
                res.status(200).json({ message: 'Node deleted successfully' });
            }
        );
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});
app.post('/addRequest', (req, res) => {
  // Extract data from req.body
  const { toolname, description, imageurl, contenttype, referenceurl } = req.body;

  // Check if the required field "toolname" is provided
  if (!toolname) {
    return res.status(400).send('Tool Name is required');
  }

  // Execute the INSERT query to add the request to the "requests" table
  pool.query(
    `INSERT INTO public."request" (toolname, description, imageurl, contenttype, referenceurl) VALUES ($1, $2, $3, $4, $5)`,
    [toolname, description, imageurl, contenttype, referenceurl],
    (err, result) => {
      if (err) {
        console.error('Error adding request to the "requests" table:', err);
        return res.status(500).send('Error adding request');
      }
      console.log('Request added to the "requests" table');
      res.status(200).send('Request added successfully');
    }
  );
});


app.get('/getRequestInfo/:requestId', (req, res) => {
  const requestId = req.params.requestId;

  // Execute a SELECT query to retrieve request information based on the request ID
  pool.query(
    `SELECT * FROM public."request" WHERE id = $1`,
    [requestId],
    (err, result) => {
      if (err) {
        console.error('Error retrieving request information:', err);
        return res.status(500).send('Error retrieving request information');
      }

      if (result.rows.length === 0) {
        return res.status(404).send('Request not found');
      }

      const requestInfo = result.rows[0];
      res.status(200).json(requestInfo);
    }
  );
});

app.post('/addRequest2', (req, res) => {
  // Extract data from req.body
  const { toolname, referenceurl, generativeecosystemlayer, contenttype, enterprisecategory, freeversion, paidversion, licensingtype, imageurl, description } = req.body;

  // Check if the required field "Tool Name" is provided
  if (!toolname) {
    return res.status(400).send('Tool Name is required');
  }

  // Validate and sanitize input data here if needed

  pool.query(
    `INSERT INTO public."ai_tools2" ("Tool Name", "Reference URL", "Generative Ecosystem Layer", "Content Type", "Enterprise Category", "Free Version", "Paid Version", "Licensing Type", "imageURL", "Description") 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [toolname, referenceurl, generativeecosystemlayer, contenttype, enterprisecategory, freeversion, paidversion, licensingtype, imageurl, description],
    (err, result) => {
      if (err) {
        console.error('Error adding request attributes to the main database:', err);
        return res.status(500).send('Error adding request attributes to the main database');
      }
      console.log('Request attributes added to the main database');
      res.status(200).send('Request attributes added successfully');
    }
  );
});




module.exports = { app };

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

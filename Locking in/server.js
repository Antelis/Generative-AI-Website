const express = require('express');
const app = express();
const path = require('path');
const { Pool } = require('pg'); // Require the pg library for PostgreSQL
const bodyParser = require('body-parser');


// PostgreSQL database configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'genai1', // Specify the database name
    password: '----------',
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
    pool.query('SELECT * FROM public."GenAiTools"', (err, result) => { // Specify the schema and table name
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error executing query');
        }
        // Convert result to CSV format
        const csvData = result.rows.map(row => Object.values(row).join(',')).join('\n');
        res.header('Content-Type', 'text/csv');
        res.send(csvData);
    });
});
app.post('/database', (req, res) => {
    const { toolName, toolDescription, referenceURL } = req.body; // Extract data from the request body

    // Execute the INSERT query to add the new node to the database
    pool.query(
      `INSERT INTO public."GenAiTools" ("Tool Name", "Tool Description", "Reference URL") 
      VALUES ($1, $2, $3)`,
      [toolName, toolDescription, referenceURL],
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

  app.put('/updateNode', (req, res) => {
    const { nodeId, newDescription } = req.body; // Extract data from the request body
  
    console.log('Received PUT request to update node description');
    console.log('Node ID:', nodeId);
    console.log('New Description:', newDescription);
  
    // Execute the UPDATE query to update the node description in the database
    pool.query(
      `UPDATE public."GenAiTools" SET "Tool Description" = $1 WHERE id = $2`,
      [newDescription, nodeId],
      (err, result) => {
        if (err) {
          console.error('Error executing UPDATE query:', err);
          return res.status(500).send('Error executing UPDATE query');
        }
        console.log('Node description updated in PostgreSQL database!');
        res.status(200).send('Node description updated successfully');
      }
    );
  });
  
// DELETE endpoint for deleting nodes
app.delete('/deleteNode', (req, res) => {
    const { nodeId, nodeName } = req.body;
  
    if (nodeId) {
      // Delete node by ID
      pool.query(
        `DELETE FROM public."GenAiTools" WHERE id = $1`,
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
    } else if (nodeName) {
      // Delete node by name
      pool.query(
        `DELETE FROM public."GenAiTools" WHERE "Tool Name" = $1`,
        [nodeName],
        (err, result) => {
          if (err) {
            console.error('Error executing DELETE query:', err);
            return res.status(500).send('Error executing DELETE query');
          }
          console.log('Node deleted from PostgreSQL database by name');
          res.status(200).json({ message: 'Node deleted successfully' });
        }
      );
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

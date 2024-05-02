const request = require('supertest');
const { app, closeServer } = require('./server');

describe('GET /', () => {

    it('responds with status 200 and serves the homepage', async () => {
        const response = await request(app)
            .get('/');
        
        expect(response.status).toBe(200);
        // Add more expectations based on the response for this endpoint
    });
});

describe('POST /database', () => {
    it('adds a new node to the database', async () => {
        const newNode = {
            toolName: 'New dasdsa',
            referenceURL: 'https://example.com',
            generativeAiEcosystemLayer: 'Layer 1',
            contentType: 'Code',
            primaryEnterpriseCategory: 'Category 1',
            complimentaryEnterpriseCategory: 'Category 2',
            freeVersionOption: "Free trial",
            paidVersionOption: "Subscription",
            licensingType: 'Open Source',
            toolDescription: 'Description of the new tool'
        };

        const response = await request(app)
            .post('/database')
            .send(newNode);

        expect(response.status).toBe(200);

    });
});
describe('PUT /updateNode', () => {

    it('updates an existing node in the database', async () => {
        // Define the updated node data
        const updatedNode = {
            nodeId: 60, // Assuming the node ID to update is 1
            toolName: 'csczx Tool Name',
            referenceURL: 'https://updated-example.com',
            generativeAiEcosystemLayer: 'Updated Layer',
            contentType: 'Updated Content Type',
            primaryEnterpriseCategory: 'Updated Category',
            complimentaryEnterpriseCategory: 'Updated Complimentary Category',
            freeVersionOption: 'Updated Free Trial',
            paidVersionOption: 'Updated Subscription',
            licensingType: 'Updated Licensing Type',
            toolDescription: 'Updated Description'
        };

        const response = await request(app)
            .put('/updateNode')
            .send(updatedNode);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Node information updated successfully');
        // You can add more expectations based on your response structure and logic
    });
});


describe('DELETE /deleteNode', () => {


    it('deletes a node by ID from the database', async () => {
        // Define the node ID to delete
        const nodeIdToDelete = 1; // Assuming the node ID to delete is 1

        const response = await request(app)
            .delete('/deleteNode')
            .send({ nodeId: nodeIdToDelete });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Node deleted successfully');
        // Add more expectations based on your response structure and logic
    });


});

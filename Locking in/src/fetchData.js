fetch('https://drive.google.com/uc?export=download&id=1aw9iv08NFcIhe8ZqNFqMqkKMrNKKam84').then(response => {
    if (response.ok) {

        return response.json();

        }
        throw new Error('Request failed');
  }, networkError => console.log(networkError.message)
).then(jsonResponse => {
    //code to execute with jsonResponse
});

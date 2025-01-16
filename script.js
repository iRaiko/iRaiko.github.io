document.addEventListener('DOMContentLoaded', function() {
     fetch('recipes.json') // Fetch the JSON file
         .then(response => response.json()) // Convert response to JSON
         .then(data => {
           console.log(data);
      })
      .catch(error => console.error('Error fetching recipes:', error)); // Handle any errors

});

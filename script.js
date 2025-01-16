var recipes = null;

console.log("test");

document.addEventListener('DOMContentLoaded', function() {
     fetch('recipes.json') // Fetch the JSON file
         .then(response => { console.log(response); response.json() }) // Convert response to JSON
         .then(data => {
           console.log(data);
           recipes = data;
      })
      .catch(error => console.error('Error fetching recipes:', error)); // Handle any errors
});

var button = document.getElementById("testClass");
button.innerHTML = "haha yes";

button.onclick = function() { alert('clicked'); };

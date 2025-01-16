var recipes = null;

console.log("test");

var button = document.getElementById("testClass");
var div = document.getElementById("json");
button.innerHTML = "haha yes";

button.onclick = function() 
{ 
  getJson().then((json) => div.innerHTML = json);
  alert('clicked'); 
};


async function getJson() {
  return fetch("recipes.json").then((response) => response.json());
}




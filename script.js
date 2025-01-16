var recipes = null;

console.log("test");

var button = document.getElementById("testClass");
var div = document.getElementById("json");
button.innerHTML = "haha yes";

button.onclick = async function() 
{ 
  var response = await fetch("recipes.json");
  var json = await response.json();
  console.log(json);
  alert('clicked'); 
};


async function getJson() {
  return fetch("recipes.json").then((response) => response.json());
}




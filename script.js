var recipes = [];
var catagories = {};

console.log("test");

var button = document.getElementById("getJson");
var div = document.getElementById("json");
var nav = document.getElementById("navigation");
button.innerHTML = "get json";

button.onclick = async function() 
{ 
  var response = await fetch("recipes.json");
  var json = await response.json();
  nav.innerHTML = "<a href='Raiko/SpaghettiCarbonara.html'>link</a>";
  console.log(json);
  alert('clicked'); 
};


async function getJson() {
  return fetch("recipes.json").then((response) => response.json());
}
var template = document.getElementById("buttonTemplate");
var buttons = document.getElementById("buttons");
buttons.appendChild(template.cloneNode(true));






var recipes = [];
var catagories = {};

console.log("test");

var button = document.getElementById("getJson");
var div = document.getElementById("json");
var nav = document.getElementById("navigation");
var nav = document.getElementById("navbar");
button.innerHTML = "get json";

button.onclick = async function() 
{ 
  var response = await fetch("recipes.json");
  var json = await response.json();
  for(const person in json) {
    for(const recipe of json[person]) {
      nav.innerHTML += "<a href=" + person + "/" + recipe[0] + ">" + recipe[0] + "</a>";
    }
  }
  console.log(json);
  alert('clicked'); 
};


async function getJson() {
  return fetch("recipes.json").then((response) => response.json());
}
var template = document.getElementById("buttonTemplate");
var buttons = document.getElementById("buttons");
buttons.appendChild(template.cloneNode(true));






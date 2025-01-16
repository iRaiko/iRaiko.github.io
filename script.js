var recipes = null;

console.log("test");

var button = document.getElementById("testClass");
var div = document.getElementById("json");
var nav = document.getElementById("navigation");
button.innerHTML = "haha yes";

button.onclick = async function() 
{ 
  var response = await fetch("recipes.json");
  var json = await response.json();
  json.Raiko.foreach((e) => nav.innerHTML += "<a href='Raiko/SpaghettiCarbonara.html'>link</a>");
  console.log(json);
  alert('clicked'); 
};


async function getJson() {
  return fetch("recipes.json").then((response) => response.json());
}




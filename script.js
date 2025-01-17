var recipes = [];
var catagories = {};

var button = document.getElementById("getJson");
var div = document.getElementById("json");
var nav = document.getElementById("navigation");
var navbar = document.getElementById("navbar");
console.log(navbar);
button.innerHTML = "get json";

button.onclick = async function() 
{ 
  var response = await fetch("recipes.json");
  var json = await response.json();
  for(const person in json) {
    var navbar = document.getElementById("navbar");
    var li_person_name = document.createElement("li");
    var a_person_name = document.createElement("a");
    a_person_name.href = "#";
    a_person_name.textContent = person;
    li_person_name.appendChild(a_person_name);
    console.log(li_person_name);
    console.log(navbar);
    for(const recipe of json[person]) {
      nav.innerHTML += "<a href=" + person + "/" + recipe[0] + ">" + recipe[0] + "</a>";
    }

    navbar.appendChild(li_person_name);
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






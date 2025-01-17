var recipes = [];
var catagories = {};

var button = document.getElementById("getJson");
var div = document.getElementById("json");
var nav = document.getElementById("navigation");
button.innerHTML = "get json";

button.onclick = async function() 
{ 
  var response = await fetch("recipes.json");
  var json = await response.json();
  for(const person in json) {
    catagories[person] = {};
    catagories[person]["All"] = [];
    var li_person_name = document.createElement("li");
    var ul_person_name = document.createElement("ul");
    ul_person_name.classList.add("nestlist");
    var a_person_name = document.createElement("a");
    a_person_name.href = "#";
    a_person_name.textContent = person;
    li_person_name.appendChild(a_person_name);
    li_person_name.appendChild(ul_person_name);
    for(const recipe of json[person]) {
      nav.innerHTML += "<a href=" + person + "/" + recipe[0] + ">" + recipe[0] + "</a>";
      for(const catagory of recipe.slice(1)) {
        catagories[person]["All"].push(recipe[0]);
        catagories[person][catagory] = catagories[person][catagory] || [];
        catagories[person][catagory].push(recipe[0]);
      }
    }
    var navbar = document.getElementById("navbar");
    console.log(navbar);
    navbar.appendChild(li_person_name);
  }
  console.log(catagories);
  console.log(json);
  alert('clicked'); 
};
var navbar = document.getElementById("navbar");
console.log(navbar);


async function getJson() {
  return fetch("recipes.json").then((response) => response.json());
}
var template = document.getElementById("buttonTemplate");
var buttons = document.getElementById("buttons");
buttons.appendChild(template.cloneNode(true));





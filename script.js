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
    for(const recipe of json[person]) {
      catagories[person]["All"].push(recipe[0]);
      for(const catagory of recipe.slice(1)) {
        catagories[person][catagory] = catagories[person][catagory] || [];
        catagories[person][catagory].push(recipe[0]);
      }
    }
  }
  for(const person in catagories) {
    var ul_person_name = document.createElement("ul");
    var li_person_name = document.createElement("li");
    var a_person_name = document.createElement("a");
    ul_person_name.classList.add("nestlist");
    a_person_name.href = "#";
    a_person_name.textContent = person;
    li_person_name.appendChild(a_person_name);
    li_person_name.appendChild(ul_person_name);
    for(const catagory in person) {
      var ul_catagory_name = document.createElement("ul");
      var li_catagory_name = document.createElement("li");
      var a_catagory_name = document.createElement("a");
      ul_catagory_name.classList.add("nestlist", "inner")
      a_catagory_name.href = "#";
      a_catagory_name.textContent = catagory;
      li_catagory_name.appendChild(a_catagory_name);
      li_catagory_name.appendChild(ul_catagory_name);
      for(const recipe of catagory) {
        var li_recipe_name = document.createElement("li");
        var a_recipe_name = document.createElement("a");
        a_recipe_name.href = person + "/" + recipe;
        a_recipe_name.textContent = recipe;
        li_recipe_name.appendChild(a_recipe_name);
        ul_catagory_name.appendChild(li_recipe_name);
      }
    }
    var navbar = document.getElementById("navbar");
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





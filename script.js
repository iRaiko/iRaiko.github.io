var recipes = [];
var catagories = {};

async function navigation() 
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
    for(const catagory in catagories[person]) {
      var ul_catagory_name = document.createElement("ul");
      var li_catagory_name = document.createElement("li");
      var a_catagory_name = document.createElement("a");
      ul_catagory_name.classList.add("nestlist", "inner")
      a_catagory_name.href = "#";
      a_catagory_name.textContent = catagory;
      li_catagory_name.appendChild(a_catagory_name);
      li_catagory_name.appendChild(ul_catagory_name);
      for(const recipe of catagories[person][catagory]) {
        var li_recipe_name = document.createElement("li");
        var a_recipe_name = document.createElement("a");
        var recipe_link = person + "/" + recipe;
        recipes.push(recipe_link);
        a_recipe_name.href = recipe_link;
        a_recipe_name.textContent = recipe;
        li_recipe_name.appendChild(a_recipe_name);
        ul_catagory_name.appendChild(li_recipe_name);
      }
      ul_person_name.appendChild(li_catagory_name);
    }
    var navbar = document.getElementById("navbar");
    navbar.appendChild(li_person_name);
  }
};


var button = document.getElementById("random");
var input = document.getElementById("randomCount");
button.onclick = function () {
  var div = document.getElementById("links");
  div.innerHTML = '';
  for(var i = 0; i < Number(input.value); i++) {
    const random = Math.floor(Math.random() * recipes.length);
    var link = document.createElement("a");
    link.href = recipes[random];
    link.textContent = recipes[random];
    div.appendChild(link);
  }
}

navigation();

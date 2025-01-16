var recipes = null;

console.log("test");

var button = document.getElementById("testClass");
button.innerHTML = "haha yes";

button.onclick = function() 
{ 
  fetch("recipes.json")
    .then((value) => { console.log(value)});
  alert('clicked'); 
};

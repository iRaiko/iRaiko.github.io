var recipes = null;

console.log("test");

var button = document.getElementById("testClass");
var div = document.getElementById("json");
button.innerHTML = "haha yes";

button.onclick = function() 
{ 
  fetch("recipes.json")
    .then((value) => 
      { 
        var json = value.json(); 
        console.log(json)
        div.innerHTML = json;
      } 
  );
  alert('clicked'); 
};


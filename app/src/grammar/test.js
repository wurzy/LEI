obj = {
    min: Math.floor(5),
    max: Math.floor(9),
    code: `return Math.floor(Math.random() * (${Math.floor(5)} - ${Math.floor(9)} + 1) + ${Math.floor(9)});`
  }

var F=new Function (obj.code);

console.log(F());
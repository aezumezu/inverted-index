'use strict';

function MyLibrary() {
  var result = [];
  
  this.isObject = function(ob) {
    return (ob.toString() === {}.toString());
  };
  
  this.values = function(ob) {
    var result = [];
    Object.keys(ob).forEach((key) => {
      result.push(ob[key]);
    });
    return result;
  };
  
  this.words = function(str) {
    str = removeSpecial(str).split(' ');
    str = str.filter((item) => {
      return /\S/.test(item);
    });
    return str;
  };
  
  var removeSpecial = function(str) {
    return str.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()]/g," ");
  };
  
  this.uniq = function(arr) {
    var g = [];
    arr.map((item) => {
      if (!g.includes(item)) g.push(item);
    });
    return g;
  };
  
  this.flatten = function(input) {
    if(Array.isArray(input)) {
      input.forEach((item) => {
        this.flatten(item);
      })
    } else {
      result.push(input);
    }
    return result;
  };
  
  this.cleanUpTemp = function(){
    result = [];
  };
  
}

module.exports = MyLibrary;
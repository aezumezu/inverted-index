'use strict';

module.exports = {
  result: [],
  
  isObject: function(ob) {
    return (ob.toString() === {}.toString());
  },
  
  values: function(ob) {
    var result = [];
    Object.keys(ob).forEach((key) => {
      result.push(ob[key]);
    });
    return result;
  },
  
  words: function(str) {
    str = this.removeSpecial(str).split(' ');
    str = str.filter((item) => {
      return /\S/.test(item);
    });
    return str;
  },
  
  removeSpecial: function(str) {
    return str.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()]/g," ");
  },
  
  uniq: function(arr) {
    var g = [];
    arr.map((item) => {
      if (!g.includes(item)) g.push(item);
    });
    return g;
  },
  
  flatten: function(input) {
    if(Array.isArray(input)) {
      input.forEach((item) => {
        this.flatten(item);
      });
    } else {
      this.result.push(input);
    }
    return this.result;
  },
  
  cleanUpTemp: function(){
    this.result = [];
  }
  
};

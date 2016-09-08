module.exports = {
  result: [],

  // verifies if ob is an Object
  isObject: function(ob) {
    'use strict';
    let result = ob.toString() === {}.toString();
    return result;
  },

  // returns the values in an object
  values: function(ob) {
    'use strict';
    let result = [];
    Object.keys(ob).forEach((key) => {
      result.push(ob[key]);
    });
    return result;
  },

  // returns an array of words in a string
  words: function(str) {
    'use strict';
    str = this.removeSpecial(str).split(' ');
    str = str.filter((item) => {
      return /\S/.test(item);
    });
    return str;
  },

  // strips a strind of all special character
  removeSpecial: function(str) {
    'use strict';
    return str.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()]/g, ' ');
  },

  // remove duplicate terms in an array
  uniq: function(arr) {
    'use strict';
    let g = [];
    arr.map((item) => {
      if (!g.includes(item)) {
        g.push(item);
      }
    });
    return g;
  },

  // gets all the strings in an Objecr
  parseObject: function(ob) {
    'use strict';
    let result = [];

    Object.keys(ob).map(item => {
      result.push(this.words(item));
      result.push(this.words(ob[item]));
    });

    return this.flatten(result);
  },

  // returns a one dimentional array from
  // a multi-dimentional array input
  flatten: function(input) {
    'use strict';
    if(Array.isArray(input)) {
      input.forEach((item) => {
        this.flatten(item);
      });
    } else if(this.isObject(input)) {
      return this.parseObject(input);
    } else {
      this.result.push(input);
    }
    return this.result;
  },

  // empties the variable
  cleanUpTemp: function() {
    'use strict';
    this.result = [];
  }

};

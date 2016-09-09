module.exports = {
  result: [],

  isObject: function(ob) {
    'use strict';
    let result = ob.toString() === {}.toString();
    return result;
  },

  values: function(ob) {
    'use strict';
    let result = [];
    Object.keys(ob).forEach((key) => {
      result.push(ob[key]);
    });
    return result;
  },

  words: function(str) {
    'use strict';
    str = this.removeSpecial(str).split(' ');
    str = str.filter((item) => {
      return /\S/.test(item);
    });
    return str;
  },

  removeSpecial: function(str) {
    'use strict';
    return str.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()]/g, ' ');
  },

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

  parseObject: function(ob) {
    'use strict';
    let result = [];

    Object.keys(ob).map(item => {
      result.push(this.words(item));
      result.push(this.words(ob[item]));
    });

    return this.flatten(result);
  },

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

  cleanUpTemp: function() {
    'use strict';
    this.result = [];
  }

};

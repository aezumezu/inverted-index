/*
An inverted index object takes a JSON array of text objects and creates
an index from the array. The index allows a user to search for text blocks
in the array that contain a specified collection of words.
*/


// create Index class
function Index() {
  'use strict';
  this.myLib = require('./invertedIndexLib');
  this.fs = require('fs');
  this.path = require('path');
  this.util = require('util');
  this.currentFile = '';
  this.currentDataIndex = {};
  this.wordIndex = {};
  this.searchResult = {};
  this.dataObject = [];
}

/**
* createIndex
*
* accepts and reads JSON file
*
* @param {String} filePath
*/
Index.prototype.createIndex = function(filePath) {
  'use strict';
  this.currentFile = this.path.resolve(filePath);
  this.fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err.message;
    }
    this.readObject(data);
  });
};

/**
* readObject
*
* Confirms the content of JSON file
*
* @param {JSON object} data
* @return {String} || {Function}
*/
Index.prototype.readObject = function(data) {
  'use strict';
  try {
    if (data.length > 0) {
      this.dataObject = JSON.parse(data.toString());
      return this.isEmpty(this.dataObject) ? 'Empty file.' : this.indexData(this.dataObject);
    }
    return 'Empty file.';
  } catch (e) {
    throw 'Error.\n The file you choose is not a valid file';
  }
};

/**
* isEmpty
*
* isEmpty confirms that the JSON file is not empty
* 
* @param {JSON object} data
* @return {boolean} trueOrFalse
*/
Index.prototype.isEmpty = function(data) {
  'use strict';
  let trueOrFalse = true;
  if(Array.isArray(data)) {
    data.forEach((item) => {
      if(this.myLib.isObject(item) && Object.keys(item).length > 0) {
        trueOrFalse = false;
        return trueOrFalse;
      }
    });
  }
  return trueOrFalse;
};

/**
* indexData
*
* This method prepares the words in the JSON for indexing
*
* @param {JSON object} data
* @return {Object} wordIndex
*/
Index.prototype.indexData = function(data) {
  'use strict';
  data.forEach((item, indexNum) => {
    let bookText = this.myLib.values(item).toString();
    let dataList = this.myLib.uniq(this.myLib.words(bookText.toLowerCase()));
    this.populate(dataList, indexNum);
  });

  this.wordIndex[this.currentFile] = this.currentDataIndex;
  this.cleanUpTemp();
  return this.wordIndex;
};

/**
* populate
*
* this method stores data inside the wordIndex Object.
*
* @param {Array, Number} (dataList, indexNum)
*/
Index.prototype.populate = function(dataList, indexNum) {
  'use strict';
  dataList.forEach((item) => {
    if(Object.keys(this.currentDataIndex).includes(item)) {
      this.currentDataIndex[item].push(indexNum);
    } else {
      this.currentDataIndex[item] = [indexNum];
    }
  });
};

/**
* cleanUpTemp
*
* used to clean temorary variable used to create index
*/
Index.prototype.cleanUpTemp = function() {
  'use strict';
  this.currentDataIndex = {};
  this.currentFile = '';
};


/**
* getIndex
*
* getIndex returns the index of the specified file
* or wordIndex if called without an argument
*
* @param {String} fileName
* @return {Object} result
*/
Index.prototype.getIndex = function(fileName) {
  'use strict';
  let result = {}, fileNameWithExt, fileNameWithOutExt;
  if(!fileName) {
    return this.wordIndex;
  }

  // looks for fileName in the Index of words
  Object.keys(this.wordIndex).forEach((indexKey) => {
    fileNameWithExt = this.path.win32.basename(indexKey) === fileName;
    fileNameWithOutExt = this.path.win32.basename(indexKey, '.json') === fileName;
    if(fileNameWithExt || fileNameWithOutExt) {
      result[indexKey] = this.wordIndex[indexKey];
    }
  });
  return Object.keys(result).length < 1 ? 'Document not found' : result;
};

/**
* searchIndex
*
* searchIndex method searches the index object and returns the search string
* Returns an object.
* 
* @param {object} term
* @return {Object} searchResult
*/
Index.prototype.searchIndex = function(term) {
  'use strict';
  this.searchResult = {};
  if (!term) {
    return 'You need to specify a search term.';
  }
  term = this.myLib.compact([...arguments]);
  if (term.length < 1) {
    return 'Invalid Search Term';
  }
  term = this.parseSearchTerm(term);
  if (term.length < 1) {
    return 'Invalid Search Term';
  }
  if(Object.keys(this.wordIndex).length < 1) {
    return 'Index is empty';
  }
  term.forEach((currentValue) => {
    this.findIndex(currentValue);
  });

  if (Object.keys(this.searchResult).length < 1) {
    return 'Term not found';
  }
  return this.util.inspect(this.searchResult, false, null);
};

/**
* parseSearchTerm
*
* this method formats the search term. Returns an array.
*
* @param {object} input
* @return {Array} term
*/
Index.prototype.parseSearchTerm = function(input) {
  'use strict';
  let term;
  if(typeof input === 'string') {
    term = this.myLib.words(input);
  } else if(Array.isArray(input)) {
    term = this.myLib.flatten(input);
  } else if(this.myLib.isObject(input)) {
    term = this.myLib.parseObject(input);
  } else {
    term = null;
  }
  this.myLib.cleanUpTemp();
  return term;
};

/**
* findIndex
*
* gets and adds the result of a search
* to the searchResult array
*
* @param {array} input
* @return {Array} term
*/
Index.prototype.findIndex = function(term) {
  'use strict';
  let indexValue;
  Object.keys(this.wordIndex).forEach((item) => {
    indexValue = this.wordIndex[item][term];
    if (indexValue &&
        Object.keys(this.searchResult).includes(term)) {
      this.searchResult[term].push([item, indexValue]);
    } else if (indexValue) {
      this.searchResult[term] = [[item, indexValue]];
    }
  });
};


module.exports = Index;

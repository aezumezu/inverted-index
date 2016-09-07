/*
An inverted index object takes a JSON array of text objects and creates
an index from the array. The index allows a user to search for text blocks
in the array that contain a specified collection of words.
*/
'use strict';
var myLib = require('./invertedIndexLib');
var fs = require('fs');
var path = require('path');

// create Index class
function Index () {
  this.currentFile = '';
  this.currentDataIndex = {};  
  this.wordIndex = {};
  this.searchResult = {};
}

// createIndex accepts and reads JSON file
Index.prototype.createIndex = function(filePath){
  this.currentFile = path.resolve(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) return console.log('There was an Error Reading File. View Details Below.\n', err.message);
    if (data.length > 0){
      var dataObject = JSON.parse(data.toString());
      return (this.isEmpty(dataObject)) ? 'Empty file.' : this.indexData(dataObject);
    }
    return console.log('Empty file.');
  });
};
  
// isEmpty confirms that the JSON file is not empty
// Returns true of false.
Index.prototype.isEmpty = function(data) {
  var trueOrFalse = true;
  if(Array.isArray(data)){
    data.forEach((item) => {
      if(myLib.isObject(item) && Object.keys(item).length > 0) return (trueOrFalse = false);
    });
  }
  return trueOrFalse;
};
  
// This method prepares the words in the JSON for indexing
Index.prototype.indexData = function(data) {
  data.forEach((item, indexNum) => {
    var bookText = myLib.values(item).toString();
    var dataList = myLib.uniq(myLib.words(bookText.toLowerCase()));
    this.populate(dataList, indexNum);
  });
  this.wordIndex[this.currentFile] = this.currentDataIndex;
  this.cleanUpTemp();
  return this.wordIndex;
};

// this method stores data inside the wordIndex Object.
Index.prototype.populate = function(dataList, indexNum) {
  dataList.forEach((item) => {
    if (Object.keys(this.currentDataIndex).includes(item)){
      this.currentDataIndex[item].push(indexNum);
    } else {
      this.currentDataIndex[item] = [indexNum];
    }
  });
};

// used to clean temorary variable used to create index
Index.prototype.cleanUpTemp = function() {
  this.currentDataIndex = {};
  this.currentFile = '';
};

// getIndex returns the index of the specified file
// or wordIndex if called without an argument
Index.prototype.getIndex = function(fileName){
  var result = {}, fileNameWithExt, fileNameWithOutExt;
  if(fileName === undefined) return this.wordIndex;
  Object.keys(this.wordIndex).forEach((indexKey) => {
    fileNameWithExt = path.win32.basename(indexKey) === fileName;
    fileNameWithOutExt = path.win32.basename(indexKey, '.json') === fileName;
    if(fileNameWithExt || fileNameWithOutExt) result[indexKey] = this.wordIndex[indexKey];
  });
  return Object.keys(result).length < 1 ? 'Document not found' : result;
};

// searchIndex method searches the index object and returns the search string
// Returns an object.
Index.prototype.searchIndex = function(term){
  this.searchResult = {};
  term = this.parseSearchTerm(term);
  if(Object.keys(this.wordIndex).length < 1) return 'Index is empty';
  term.forEach((currentValue) => {
    this.findIndex(currentValue);
  });
  if (Object.keys(this.searchResult).length < 1){
    return 'Term not found';
  }
  return this.searchResult;
};

Index.prototype.findIndex = function(term) {
  var indexValue;
  Object.keys(this.wordIndex).forEach((item) => {
    indexValue = this.wordIndex[item][term];
    if (indexValue !== undefined && Object.keys(this.searchResult).includes(term)){
      this.searchResult[term].push([item, indexValue]);
    } else if (indexValue !== undefined) {
      this.searchResult[term] = [[item, indexValue]];
    }
  });
};

//this method formats the search term. Returns an array.
Index.prototype.parseSearchTerm = function(input) {
  var term;
  if(typeof input === 'string') {
    term = myLib.words(input);
  } else if(Array.isArray(input)) {
    term = myLib.flatten(input);
    myLib.cleanUpTemp();
  }
  return term;
};

module.exports= Index;

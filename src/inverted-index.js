/*
An inverted index object takes a JSON array of text objects and creates
an index from the array. The index allows a user to search for text blocks
in the array that contain a specified collection of words.
*/
'use strict';

// create Index class
function Index () {
  var _ = require('lodash');
  var fs = require('fs');
  var path = require('path');
  var currentFile = '';
  var currentDataIndex = {};
  
  this.wordIndex = {};
  
  // createIndex accepts and reads JSON file
  this.createIndex = function(filePath){
    currentFile = path.resolve(filePath);
    var that = this;
    fs.readFile(filePath, function(err, data){
      if (err) console.log('There was an Error Reading File. View Details Below.\n', err.message);
      if (data.length > 0){
        var dataObject = JSON.parse(data.toString());
        that.isEmpty(dataObject);
      }else{
        console.log('Empty file.');
      }
    });
  };
  
  // isEmpty confirms that the JSON file is not empty
  // Returns true of false.
  this.isEmpty = function(data) {
    var trueOrFalse = true;
    if(Object.prototype.toString.call(data) === Object.prototype.toString.call([])){
      for( var i = 0; i < data.length; i++){
        if(Object.prototype.toString.call(data[i]) === Object.prototype.toString.call({})){
          if(indexData(data[i], i) && (trueOrFalse !== false)) trueOrFalse = false;
        }
      }
      this.wordIndex[currentFile] = currentDataIndex;
      cleanUpTemp();
      return trueOrFalse;
    }else{
      return true;
    }  
  };
  
  // getIndex returns the index of the specified file
  // or wordIndex if called without an argument
  this.getIndex = function(fileName){
    var result;
    if(fileName === undefined) return this.wordIndex;
    for(var indexKeys in this.wordIndex) {
      if(path.win32.basename(indexKeys) === fileName || path.win32.basename(indexKeys, '.json') === fileName) {
        result = this.wordIndex[indexKeys];
      }
    }
    return result;
  };
  
  // used to clean temorary variable used to create index
  var cleanUpTemp = function() {
    currentDataIndex = {};
    currentFile = '';
  };
  
  // This method carries out the actual indexing of the JSON file
  // It populates the wordIndex Object.
  var indexData = function(data, indexNum) {
    if (Object.keys(data).length < 1) return false;
    var bookText = _.values(data).toString();
    var dataList = _.uniq(_.words(bookText.toLowerCase()));
    for(var i = 0; i < dataList.length; i++){
      if(Object.keys(currentDataIndex).includes(dataList[i])){
        currentDataIndex[dataList[i]].push(indexNum);
      } else {
        currentDataIndex[dataList[i]] = [indexNum];
      }
    }
    return true;
  };
  
  // searchIndex method searches the index object and returns the search string
  // Returns an object.
  this.searchIndex = function(term){
    var result = {};
    var getValue, queryString;
    var wordIndexLength = Object.keys(this.wordIndex).length;
    term = parseSearchTerm(term);
    if(wordIndexLength < 1) return 'Index is empty';
    var that = this;
    term.map(function(currentValue){
      for(var indexKey in that.wordIndex){
        queryString = currentValue;
        getValue = _.get(that.wordIndex[indexKey], queryString);
        if (getValue !== undefined && Object.keys(result).includes(queryString)){
          result[queryString].push([indexKey, getValue]);
        } else if (getValue !== undefined) {          
          result[queryString] = [[indexKey, getValue]];
        }
      }
    });
    if (Object.keys(result).length < 1){
      return 'Term not found';
    }
    return result;
  };
  
  //this method formats the search term. Returns an array.
  var parseSearchTerm = function(input) {
    var term;
    
    if(Object.prototype.toString.call(input) === Object.prototype.toString.call('')) {
      term = _.words(input);
    } else if(Object.prototype.toString.call(input) === Object.prototype.toString.call([])) {
      term = _.flattenDeep(input);
    }
    return term;
  };
  
}

module.exports= Index;

'use strict';
var app = require('../src/inverted-index');
var path = require('path');
var newIndex;

describe('Read book data', function() {
  
  beforeEach(function() {    
    newIndex = new app();
  });
  
  it('reads the JSON file and asserts that it is not empty', function () {
    newIndex.createIndex('./books.json');
    var book1Data = newIndex.dataObject;
    expect(newIndex.isEmpty([{},{'one': 'Bigone'}])).toBe(false);
    expect(newIndex.isEmpty(book1Data)).toBe(false);
  });
  
  it('throws error for empty book.json files.', function () {
    expect(newIndex.isEmpty(JSON.parse('[]'))).toBe(true);
    expect(newIndex.isEmpty(JSON.parse('[{}]'))).toBe(true);
    expect(newIndex.isEmpty('')).toBe(true);
    expect(newIndex.isEmpty()).toBe(true);
  });
  
  it('return true for book.json files. without objects.', function () {
    expect(newIndex.isEmpty('hello world')).toBe(true);
    expect(newIndex.isEmpty(['hello', 'come', 1])).toBe(true);
  });
});

describe('Populate index', function () {
  var indexLength;
  
  beforeEach(function() {    
    newIndex = new app();
  });
  
  it('verifies that the indexes where created once json file is read.', function () {
    indexLength = Object.keys(newIndex.wordIndex).length;
    newIndex.createIndex('./books.json');
    expect(Object.keys(newIndex.wordIndex).length).toBeGreaterThan(indexLength);
  });
  
  it('verifies the index maps the string keys to the correct objects in the JSON array.', function() {
    var answer = {'alice': [[path.resolve('./books.json'), [0]]]};
    newIndex.createIndex('./books.json');
    expect(newIndex.searchIndex('alice')).toEqual(answer);
  });
});

describe('Search index', function(){
  
  beforeEach(function() {    
    newIndex = new app();
    newIndex.createIndex('./books.json');
  });
  
  it('returns an array of indices of the object that contains search query.', function(){
    var answer = {'of': [[path.resolve('./books.json'), [0, 1]]]};
    expect(newIndex.searchIndex('of')).toEqual(answer);
  });
  
  it('returns an array of indices of the object that contains search query.', function(){
    newIndex.createIndex('./crater.json');
    var answer = { 'of':  [ [ path.resolve('./books.json'), [0, 1] ], [ path.resolve('./crater.json'), [1] ] ] };
    expect(newIndex.searchIndex('of')).toEqual(answer);
  });
  
  it('returns "Term not found" for search query not in Index.', function(){
    expect(newIndex.searchIndex('office')).toEqual('Term not found');
  });
    
  it('can accpet object input as search term.', function(){
    var answer = {'of': [[path.resolve('./books.json'), [0, 1]]], "alice":[["D:\\Andela_Checkpoints\\CP1\\inverted-index\\books.json",[0]]]};
    expect(newIndex.searchIndex([{of: 'alice'}])).toEqual(answer);
    expect(newIndex.searchIndex({of: 'alice'})).toEqual(answer);
  });
  
  it('returns "Index is empty" if Index collection is empty.', function(){
    newIndex.wordIndex = {};
    expect(newIndex.searchIndex('of')).toEqual('Index is empty');
  });
    
  it('returns "Invalid search term" for invalid search inputs.', function(){
    expect(newIndex.searchIndex()).toEqual('Invalid Search Term');
    expect(newIndex.searchIndex('  ')).toEqual('Invalid Search Term');
  });
});

describe('ParseSearchTerm', function(){
  
  beforeEach(function() {    
    newIndex = new app();
    newIndex.createIndex('./books.json');
  });
  it('returns a one dimensional array.', function(){
    var inputArray = ['alice', ['jerry', 'car', ['item']], 'correct'];
    var inputString = 'alice, jerry. car item correct';
    var answer = ['alice', 'jerry', 'car', 'item', 'correct'];
    expect(newIndex.parseSearchTerm(inputArray)).toEqual(answer);
    expect(newIndex.parseSearchTerm(inputString)).toEqual(answer);
  });
  
});

describe('getIndex Method', function(){
  
  beforeEach(function() {    
    newIndex = new app();
    newIndex.createIndex('./books.json');
    newIndex.createIndex('./crater.json');
  });
  
  it('returns the entire index object without parameter.', function(){
    expect(newIndex.getIndex()).toEqual(newIndex.wordIndex);
  });
  
  it('returns the specified index in index object.', function(){
    var indexValue = newIndex.getIndex('books');
    newIndex.wordIndex = {};
    newIndex.createIndex('./books.json');
    expect(indexValue).toEqual(newIndex.wordIndex);
  });
  
});

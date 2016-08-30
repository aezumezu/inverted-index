'use strict';
var app = require('../src/inverted-index');
var newIndex;
var book1Data = [{"title": "Alice in Wonderland","text": "Alice falls into a rabbit hole and enters a world full of imagination."},{"title": "The Lord of the Rings: The Fellowship of the Ring.","text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."}];

describe('Read book data', function () {
  
  beforeEach(function () {
    newIndex = new app();
  });
  
  it('reads the JSON file and asserts that it is not empty', function () {
    expect(newIndex.isEmpty([{},{'one': 'Bigone'}])).toBe(false);
  });
  
  it('throws error for empty book.json files.', function () {
    expect(newIndex.isEmpty([])).toBe(true);
    expect(newIndex.isEmpty([{}])).toBe(true);
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
  beforeEach(function () {
    newIndex = new app();
  });
  
  it('verifies that the indexes where created once json file is read.', function () {
    indexLength = Object.keys(newIndex.wordIndex).length;
    newIndex.isEmpty(book1Data);
    expect(Object.keys(newIndex.wordIndex).length).toBeGreaterThan(indexLength);
  });
  
  it('verifies the index maps the string keys to the correct objects in the JSON array.', function () {
    newIndex.isEmpty(book1Data);
    expect(newIndex.searchIndex('rabbit')).toEqual({'rabbit': [['', [0]]]});
  });
});

describe('Search index', function(){
  
  beforeEach(function () {
    newIndex = new app();
    newIndex.isEmpty(book1Data);
  });
  
  it('returns an array of indices of the object that contains search query.', function(){
    expect(newIndex.searchIndex('of')).toEqual({'of': [['', [0, 1]]]});
  });
  
  it('returns "Term not found" for search query not in Index.', function(){
    expect(newIndex.searchIndex('office')).toEqual('Term not found');
  });
  
  it('returns "Index is empty" if Index collection is empty.', function(){
    newIndex.wordIndex = {};
    expect(newIndex.searchIndex('of')).toEqual('Index is empty');
  });
});

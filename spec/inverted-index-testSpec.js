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


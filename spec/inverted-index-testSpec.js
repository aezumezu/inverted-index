const APP = require('../src/inverted-index');
const PATH = require('path');
const UTIL = require('util');
let newIndex;

describe('Read book data', function() {
  'use strict';
  beforeEach(function(done) {
    newIndex = new APP();
    newIndex.createIndex('./books.json');
    done();
  });

  it('reads the JSON file and asserts that it is not empty', function(done) {
    setTimeout(function() {
      let book1Data = newIndex.dataObject;
      expect(newIndex.isEmpty([{}, {one: 'Bigone'}])).toBe(false);
      expect(newIndex.isEmpty(book1Data)).toBe(false);
      done();
    }, 300)
  });

  it('throws error for empty book.json files.', function() {
    expect(newIndex.isEmpty(JSON.parse('[]'))).toBe(true);
    expect(newIndex.isEmpty(JSON.parse('[{}]'))).toBe(true);
    expect(newIndex.isEmpty('')).toBe(true);
    expect(newIndex.isEmpty()).toBe(true);
  });

  it('return true for book.json files. without objects.', function() {
    expect(newIndex.isEmpty('hello world')).toBe(true);
    expect(newIndex.isEmpty(['hello', 'come', 1])).toBe(true);
  });
});

describe('Populate index', function() {
  'use strict';
  let indexLength;

  beforeEach(function(done) {
    newIndex = new APP();
    indexLength = Object.keys(newIndex.wordIndex).length;
    newIndex.createIndex('./books.json');
    done();
  });

  it('verifies that the indexes where created once json file is read.', function(done) {
    setTimeout(function() {
      expect(Object.keys(newIndex.wordIndex).length).toBeGreaterThan(indexLength);
      done();
    }, 300);
  });

  it('verifies the index maps the string keys to the correct objects in the JSON array.', function(done) {
    setTimeout(function() {
      let answer = {alice: [[PATH.resolve('./books.json'), [0]]]};
      expect(newIndex.searchIndex('alice')).toEqual(UTIL.inspect(answer, false, null));
      done();
    }, 300);
  });
});

describe('Search index', function() {
  'use strict';

  beforeEach(function(done) {
    newIndex = new APP();
    newIndex.createIndex('./books.json');
    done();
  });

  it('returns an array of indices of the object that contains search query.', function(done) {
    setTimeout(function() {
      let answer = { of: [ [ PATH.resolve('./books.json'), [0, 1] ] ] };
      expect(newIndex.searchIndex('of')).toEqual(UTIL.inspect(answer, false, null));
      done();
    }, 600);
  });

  it('returns "Term not found" for search query not in Index.', function(done) {
    setTimeout(function() {
      expect(newIndex.searchIndex('office')).toEqual('Term not found');
      done();
    }, 300);
  });

  it('can accept object input as search term.', function(done) {
    setTimeout(function() {
      let answer = {fellowship: [[PATH.resolve('./books.json'), [0, 1]]],
                    alice: [[PATH.resolve('./books.json'), [0]]]};
      expect(newIndex.searchIndex([{fellowship: 'alice'}])).toEqual(UTIL.inspect(answer, false, null));
      expect(newIndex.searchIndex({fellowship: 'alice'})).toEqual(UTIL.inspect(answer, false, null));
      done();
    }, 300);
  });

  it('returns "Index is empty" if Index collection is empty.', function() {
    newIndex.wordIndex = {};
    expect(newIndex.searchIndex('of')).toEqual('Index is empty');
  });

  it('returns an error message for invalid search inputs.', function(done) {
    setTimeout(function() {
      expect(newIndex.searchIndex()).toEqual('You need to specify a search term.');
      expect(newIndex.searchIndex('  ')).toEqual('Invalid Search Term');
      done();
    }, 300);
  });
});

describe('ParseSearchTerm', function() {
  'use strict';

  beforeEach(function() {
    newIndex.createIndex('./books.json');
  });
  it('returns a one dimensional array.', function() {
    let inputArray = ['alice', ['jerry', 'car', ['item']], 'correct'];
    let inputString = 'alice, jerry. car item correct';
    let inputObject = {alice: 'jerry', car: 'item correct'};
    let answer = ['alice', 'jerry', 'car', 'item', 'correct'];
    expect(newIndex.parseSearchTerm(inputArray)).toEqual(answer);
    expect(newIndex.parseSearchTerm(inputString)).toEqual(answer);
    expect(newIndex.parseSearchTerm(inputObject)).toEqual(answer);
  });

  it('returns an error message for invalid search term.', function() {
    expect(newIndex.searchIndex(78)).toEqual('Invalid Search Term');
    expect(newIndex.searchIndex(true)).toEqual('Invalid Search Term');
    expect(newIndex.searchIndex([true])).toEqual('Invalid Search Term');
  });

});

describe('getIndex Method', function() {
  'use strict';
  let indexValue;

  beforeEach(function(done) {
    newIndex = new APP();
    newIndex.createIndex('./books.json');
    done();
  });

  it('returns the entire index object without parameter.', function(done) {
    setTimeout(function() {
      expect(newIndex.getIndex()).toEqual(newIndex.wordIndex);
      done();
    }, 300);
  });

  it('returns the specified index in index object.', function(done) {
    setTimeout(function() {
      indexValue = newIndex.wordIndex;
      expect(indexValue).toEqual(newIndex.getIndex('books'));
      done();
    }, 300);
  });

});

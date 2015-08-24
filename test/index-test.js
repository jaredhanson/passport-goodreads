var vows = require('vows');
var assert = require('assert');
var util = require('util');
var goodreads = require('..');


vows.describe('passport-goodreads').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(goodreads.version);
    },
  },
  
}).export(module);

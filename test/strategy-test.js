var vows = require('vows');
var assert = require('assert');
var util = require('util');
var GoodreadsStrategy = require('../lib/strategy');


vows.describe('GoodreadsStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new GoodreadsStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
    },
    
    'should be named goodreads': function (strategy) {
      assert.equal(strategy.name, 'goodreads');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new GoodreadsStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
        var body = '<?xml version="1.0" encoding="UTF-8"?> \
        <GoodreadsResponse> \
          <Request> \
            <authentication>true</authentication> \
              <key><![CDATA[xxxxxxxxxxxxxxxxxxxxxx]]></key> \
            <method><![CDATA[api_auth_user]]></method> \
          </Request> \
          <user id="817656"> \
        	<name><![CDATA[Jared Hanson]]></name> \
        	<link><![CDATA[http://www.goodreads.com/user/show/817656-jared-hanson?utm_medium=api]]></link> \
        </user> \
        </GoodreadsResponse>';
        
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'goodreads');
        assert.equal(profile.id, '817656');
        assert.equal(profile.displayName, 'Jared Hanson');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set xml2js property' : function(err, profile) {
        assert.isObject(profile._xml2js);
        assert.strictEqual(profile._xml2json, profile._xml2js);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new GoodreadsStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
        callback(new Error('something went wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },

}).export(module);

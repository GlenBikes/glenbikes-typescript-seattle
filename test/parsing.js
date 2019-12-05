var assert = require('assert');
var server = require('../server');
var twitmocks = require('../test/mocks/twitter.js');

const user = {
  userName: 'echo',
  avatar: 'echo.png'
};

describe('Tweet chomping', function() {
  describe('chomp reply tweet', function() {
    it('should remove users at start of full_text if display_text_range specifies a display range', function() {
      const {chomped, chomped_text} = server._chompTweet(twitmocks._createTweet({full_text: '@TestUser1 @TestUser2 This is the tweet', display_text_range: [22,17]}))
      assert.equal(chomped_text, 'This is the tweet');
    });
  });
  
  describe('chomp empty tweet', function() {
    it('should return empty string', function() {
      const {chomped, chomped_text} = server._chompTweet(twitmocks._createTweet({full_text: ''}));
      assert.equal(chomped_text, '');
    })
  });
  
  describe('chomp non-reply tweet', function() {
    it('should return exactly full_text', function() {
      const {chomped, chomped_text} =server._chompTweet(twitmocks._createTweet({full_text: 'This is just a tweet.'}));
      assert.equal(chomped_text, 'This is just a tweet.');
    })
  });
});

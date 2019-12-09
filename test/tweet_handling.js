var assert = require('assert'),
    server = require('../server'),
    sinon = require('sinon'),
    strUtils = require('../util/stringutils.js'),
    twitmocks   = require('../test/mocks/twitter.js');

describe('Tweet handling', function() {
  describe('Handle tweet with reference', function() {
    it('should write a single request to Request table', () => {
      const awsMock = require("aws-sdk-mock"),
            AWS = require("aws-sdk");
      
      awsMock.setSDKInstance(AWS);

      // Use the fake timer (now is 0).
      var now = new Date().valueOf();
      var stubNow = sinon.stub(Date, 'now').returns(now);

      const stubUuid = sinon.stub(strUtils, '_getUUID').returns( "4887b7a0-09a1-11ea-a100-f9a53a6b0433" );

      
      const batchWriteSpy = sinon.spy((params, callback) => {
        assert.equal(Object.keys(params.RequestItems)[0], server._tableNames['Request']);
        assert.equal(params.RequestItems[server._tableNames['Request']].length, 1);
        callback(null, { UnprocessedItems: [] });
      })

      var batchWriteMock = awsMock.mock('DynamoDB.DocumentClient', 'batchWrite', batchWriteSpy);

      var docClient = new AWS.DynamoDB.DocumentClient();

      var T = {
        get: ( path, params, cb) => {
          var data = {
            statuses: [
              twitmocks._createTweet({
                id: 123,
                id_str: '123',
                full_text: `Hey ${process.env.TWITTER_HANDLE} can you look up TX:78DFSD for me?`
              })
            ]
          };

          cb(null, data, null);
        }
      }

      return new Promise( ( resolve, reject) => {
        server._processNewTweets(T, docClient).then( () => {
          var expected_params = {
            RequestItems: {
              HMDWA_Request: [{
                  PutRequest: {
                      Item: {
                          id: strUtils._getUUID(),
                          license: "TX:78DFSD",
                          created: now,
                          modified: now,
                          processing_status: "UNPROCESSED",
                          tweet_id: "123",
                          tweet_id_str: "123",
                          tweet_user_id: "-1",
                          tweet_user_id_str: "-1",
                          tweet_user_screen_name: "None",
                      },
                  },
              }],
            },
          }
          assert(batchWriteSpy.calledOnce);
          batchWriteSpy.calledWithMatch(expected_params);
          resolve();
        }).catch( (err) => {
          reject(err);
        }).finally( () => {
          awsMock.restore('DynamoDB.DocumentClient', 'batchWrite');
          stubNow.restore();
        });
      });
    });
  });

  describe('Handle tweet without license', function() {
    it('should write a single request to Request table, saying no license', () => {
      const awsMock = require("aws-sdk-mock"),
            AWS = require("aws-sdk");
        
      awsMock.setSDKInstance(AWS);

      awsMock.mock('DynamoDB.DocumentClient', 'batchWrite', function(params, callback) {          
        assert.equal(Object.keys(params.RequestItems)[0], server._tableNames['Request']);
        assert.equal(params.RequestItems[server._tableNames['Request']].length, 1);
        // Make sure this is the "no license found" tweet.
        assert.equal(params.RequestItems[server._tableNames['Request']][0].PutRequest.Item.license, ':');
        callback(null, { UnprocessedItems: [] });
      });
      
      var docClient = new AWS.DynamoDB.DocumentClient();

      var T = {
        get: ( path, params, cb) => {
          var data = {
            statuses: [
              twitmocks._createTweet({
                id: 123,
                id_str: '123',
                full_text: `Hey ${process.env.TWITTER_HANDLE} can you look up TX_78DFSD for me?`
              })
            ]
          };

          cb(null, data, null);
        }
      }

      return new Promise( ( resolve, reject ) => {
        server._processNewTweets(T, docClient).then( () => {
          resolve();
          awsMock.restore('DynamoDB.DocumentClient', 'batchWrite');
        }).catch ( ( err ) => {
          reject(err);
        }).finally( () => {
          awsMock.restore('DynamoDB.DocumentClient', 'batchWrite');
        });
      });
    });
  });

  describe('Handle multiple tweets', function() {
    it('should write one request to Request table for each tweet', () => {
      const awsMock = require("aws-sdk-mock"),
            AWS = require("aws-sdk");
        
      awsMock.setSDKInstance(AWS);

      awsMock.mock('DynamoDB.DocumentClient', 'batchWrite', function(params, callback) {          
        assert.equal(Object.keys(params.RequestItems)[0], server._tableNames['Request']);
        assert.equal(params.RequestItems[server._tableNames['Request']].length, 1);
        // Make sure this is the "no license found" tweet.
        assert.equal(params.RequestItems[server._tableNames['Request']][0].PutRequest.Item.license, ':');
        callback(null, { UnprocessedItems: [] });
      });

      var docClient = new AWS.DynamoDB.DocumentClient();

      var T = {
        get: ( path, params, cb) => {
          var data = {
            statuses: [
              twitmocks._createTweet({
                id: 123,
                id_str: '123',
                full_text: `Hey ${process.env.TWITTER_HANDLE} can you look up TX_78DFSD for me?`
              })
            ]
          };

          cb(null, data, null);
        }
      }

      return new Promise( ( resolve, reject ) => {
        server._processNewTweets(T, docClient).then( () => {
          resolve();
        }).catch( ( err ) => {
          throw err;
        }).finally( () => {
          awsMock.restore('DynamoDB.DocumentClient', 'batchWrite');
        });
      });
    });
  });
});


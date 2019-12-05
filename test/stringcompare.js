var assert = require('assert'),
    server = require('../server'),
    sinon = require('sinon'),
    strUtils = require('../util/stringutils.js');

var log = server._log;

describe('Numeric string compare', function() {
  describe('Test strings with a < b', function() {
    it('return < 0', () => {
      assert(strUtils._compare_numeric_strings('1196720038423617536', '1196727525382049792') < 0);
    });
  });
  
  describe('Test strings with a < b, a shorter', function() {
    it('return < 0', () => {
      assert(strUtils._compare_numeric_strings('99', '1196727525382049792') < 0);
    });
  });
  
  describe('Test strings with a > b, a shorter', function() {
    it('return > 0', () => {
      assert(strUtils._compare_numeric_strings('1196727525382049792', '99') > 0);
    });
  });
  
  describe('Test strings with a > b, a shorter', function() {
    it('return > 0', () => {
      assert(strUtils._compare_numeric_strings('1196727525382049792', '1196720038423617536') > 0);
    });
  });
  
  describe('Test strings with a == b', function() {
    it('return == 0', () => {
      assert(strUtils._compare_numeric_strings('1196727525382049792', '1196727525382049792') == 0);
    });
  });
  
  describe('Test two empty strings', function() {
    it('return == 0', () => {
      assert(strUtils._compare_numeric_strings('', '') == 0);
    });
  });
  
  describe('Test empty string < number', function() {
    it('return < 0', () => {
      assert(strUtils._compare_numeric_strings('', '1') < 0);
    });
  });
  
  describe('Test number > empty string', function() {
    it('return > 0', () => {
      assert(strUtils._compare_numeric_strings('1', '') > 0);
    });
  });
});


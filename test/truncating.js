var assert = require('assert');
var server = require('../server');

describe('Line choppping', function() {
  describe('chop empty line', function() {
    it('should return an empty line', function() {
      var result = server._splitLines([''], 10);
      assert.equal(result.length, 1);
      assert.equal(result[0], '');
    });
  });
  
  describe('chop line into 6 pieces', function() {
    it('should return 6 strings chopped on word breaks', function() {
      var test_string = [
        "Here is a ",
        "line that ",
        "is a lot ",
        "more than ",
        "ten chars ",
        "long."
      ];
      
      var result = server._splitLines([test_string.join('')], 10);

      assert.equal(result.length, test_string.length);
      for (var i = 0; i < result.length; i++) {
        assert.equal(result[i], test_string[i]);
      }
    })
  });
  
  describe('chop line with word longer than limit', function() {
    it('should return strings chopped on a word break except for long work, chopped at limit', function() {
      var test_string = [
        'Here is a ',
        'line with ',
        'areallylon',
        'gwordthatc',
        'annotbecho',
        'pped to ',
        'something ',
        'smaller.'
      ];

      var result = server._splitLines([test_string.join('')], 10);
      
      assert.equal(result.length, test_string.length);
      for (var i = 0; i < result.length; i++) {
        assert.equal(result[i], test_string[i]);
      }
    })
  });
  
  describe('chop line on carriage returns', function() {
    it('should return a string per line, without the line break', function() {
      var test_string = [
        'Here is',
        'a string',
        'with three lines.' // this line will get split
      ];
      
      var result = server._splitLines([test_string.join('\n')], 10);
      
      assert.equal(result.length, test_string.length + 2);
      assert.equal(result[0], test_string[0]);
      assert.equal(result[1], test_string[1]);
      assert.equal(result[2] + result[3] + result[4], test_string[2]);
    })
  });
  
  describe('handle a real set of tweets', function() {
    it('should have multiple violations in each tweet', function() {
      var test_string = [
        'Total parking and camera violations for #WA:ATT2936: 23\n' +
        'PARKING: 23',
        
        '01/31/2015, PARKING, 1102 E PINE ST, PAID\n' +
        '09/15/2015, PARKING, 450 N 36TH ST, PAID\n' +
        '01/06/2016, PARKING, 605 NE 68TH ST, PAID\n' +
        '01/12/2016, PARKING, 2409 1ST AVE, PAID\n' +
        '07/06/2016, PARKING, 2019 FAIRVIEW AVE E, PAID\n' +
        '07/26/2016, PARKING, 409 NE 70TH ST, PAID\n' +
        '10/26/2016, PARKING, 5639 UNIVERSITY WAY NE, PAID\n' +
        '11/28/2016, PARKING, 5602 BROOKLYN AVE NE, PAID\n' +
        '11/28/2016, PARKING, 4508 UNIVERSITY WAY NE, PAID\n' +
        '03/19/2018, PARKING, 2001 FAIRVIEW AVE E, PAID\n' +
        '04/19/2018, PARKING, 1403 NW 54TH ST, PAID\n' +
        '05/02/2018, PARKING, 5601 UNIVERSITY WAY NE, PAID\n' +
        '08/15/2018, PARKING, 311 NE MAPLE LEAF PL, PAID\n' +
        '10/19/2018, PARKING, 5522 UNIVERSITY WAY NE, PAID\n' +
        '03/05/2019, PARKING, 4709 UNIVERSITY WAY NE, PAID\n' +
        '04/02/2019, PARKING, 4709 UNIVERSITY WAY NE, PAID\n' +
        '04/25/2019, PARKING, 7208 E GREEN LAKE DR N, PAID\n' +
        '09/10/2019, PARKING, 7208 E GREEN LAKE DR N, PAID\n' +
        '09/13/2019, PARKING, 2001 FAIRVIEW AVE E, PAID\n' +
        '09/16/2019, PARKING, 7208 E GREEN LAKE DR N, PAID\n' +
        '10/11/2019, PARKING, 3617 15TH AVE NE, PAID\n' +
        '10/14/2019, PARKING, 7208 E GREEN LAKE DR N, PAID\n' +
        '10/28/2019, PARKING, 308 NE 72ND ST, ACTIVE',
        
        'Violations by status for #WA:ATT2936:\n' +
        'PAID: 22\n' +
        'ACTIVE: 1',
        
        'Violations by year for #WA:ATT2936:\n' +
        '2015: 2\n' +
        '2016: 7\n' +
        '2018: 5\n' +
        '2019: 9'
      ];
      
      var result = server._splitLines(test_string, 280);
      
      assert.equal(result.length, 8);
    })
  });
});

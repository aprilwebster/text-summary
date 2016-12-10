/*
function ( data ) {
  var summary = new TextSummary('en'),
      summaryText = summary.getSummary(data);
  $('#textSummary').append(buildSummaryHtml(summaryText));

  $('#profile').append('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
});
*/

'use strict';
/*eslint no-console: */
//const assert = require('chai').assert;
const testProfile = require('../examples/resources/profile');
//const v3TestProfile = require('../examples/resources/v3_profile');
const TextSummary  = require('../src/main');

const textSummary = new TextSummary('en');
const summary = textSummary.getSummary(testProfile);
console.log(summary);

//const v3summary = textSummary.getSummary(v3TestProfile);
//console.log(v3summary);

describe('summaries', () => {

  it('get default (English) trait summary:', () => {
    //const textSummary = new TextSummary('en');
    //const summary = textSummary.getSummary(testProfile);
    //console.log(summary);
    //assert.equal(summary., 'Agreeableness');
    //assert.equal(traitNames.names().length, 52);
    //assert.equal(traitNames.names()[1], 'Altruism');
  });


});

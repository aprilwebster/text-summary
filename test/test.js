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
const assert = require('chai').assert;
const testProfile = require('../examples/resources/profile');
//const v3TestProfile = require('../examples/resources/v3_profile');
//const TextSummary  = require('../lib/main');
const TextSummary = require('../lib/index');

//const v3summary = textSummary.getSummary(v3TestProfile);
//console.log(v3summary);

describe('Text Summary Tests', () => {

  it('Get default (English) profile summary:', () => {
    const textSummary = new TextSummary('en');
    const summary = textSummary.getSummary(testProfile);
    //const assemble = textSummary.assemble(testProfile);
    //console.log('TEST: values ' + assemble);
    assert.equal(summary, 'You are inner-directed, restrained and rational.\nYou are empathetic: you feel what others feel and are compassionate towards them. You are self-controlled: you have control over your desires, which are not particularly intense. And you are calm-seeking: you prefer activities that are quiet, calm, and safe.\nYour choices are driven by a desire for prestige.\nYou consider helping others to guide a large part of what you do: you think it is important to take care of the people around you. You are relatively unconcerned with tradition: you care more about making your own path than following what others have done.');

  });

});

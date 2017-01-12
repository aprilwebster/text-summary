
'use strict';
/*eslint no-console: */
const assert = require('chai').assert;

const TextSummary = require('../lib/index');

const v2EnProfile = require('./sample_profiles/v2/en');
const v2EsProfile = require('./sample_profiles/v2/es');
const v2JaProfile = require('./sample_profiles/v2/ja');
const v2PersonalityProfile = require('../profiles/v2/index');

const v3EnProfile = require('./sample_profiles/v3/en');
//const v3EsProfile = require('./sample_profiles/v3/es');
//const v3JaProfile = require('./sample_profiles/v3/ja');
const v3PersonalityProfile = require('../profiles/v3/index');

var v2TestPersonalityProfile = new v2PersonalityProfile(v2EnProfile);
var v2Traits = v2TestPersonalityProfile.traits();

console.log('V2 Profile Test:');
v2Traits.forEach(function (t){
  console.log(t.name + ': ' + t.score);

  t.facets.forEach(function (f){
    console.log('\t' + f.name + ': ' + f.score);
  });

});

var v3TestPersonalityProfile = new v3PersonalityProfile(v3EnProfile);
var v3Traits = v3TestPersonalityProfile.traits();

console.log('V3 Profile Test:');
v3Traits.forEach(function (t){
  console.log(t.name + ': ' + t.score);

  t.facets.forEach(function (f){
    console.log('\t' + f.name + ': ' + f.score);
  });

});


describe('Text Summary Tests', () => {

  it('Get default (English) profile summary:', () => {
    const textSummary = new TextSummary({ locale : 'en', 'version' : 'v2' });
    const summary = textSummary.getSummary(v2EnProfile);
    assert.equal(summary, 'You are shrewd, somewhat critical and particular.\nYou are self-controlled: you have control over your desires, which are not particularly intense. You are mild-tempered: it takes a lot to get you angry. And you are assertive: you tend to speak up and take charge of situations, and you are comfortable leading groups.\nYour choices are driven by a desire for organization.\nYou are relatively unconcerned with both taking pleasure in life and achieving success. You prefer activities with a purpose greater than just personal enjoyment. And you make decisions with little regard for how they show off your talents.');



  });

  it('Get default (Spanish) profile summary:', () => {
    const textSummary = new TextSummary({ locale : 'es', 'version' : 'v2' });
    const summary = textSummary.getSummary(v2EsProfile);
    assert.equal(summary, 'Usted es perspicaz, algo crítico y detallista.\nUsted es sereno: controla sus deseos, los cuales no son particularmente intensos. Usted es apacible: es difícil hacerle enojar. Y usted es asertivo: tiende a expresarse y a hacerse cargo de las situaciones, y se encuentra cómodo liderando grupos.\nSus elecciones están determinadas por un deseo de organización.\nUsted es relativamente indiferente con disfrutar de la vida y alcanzar el éxito. Prefiere actividades con un propósito más grande que el sólo deleite personal. Y toma decisiones sin considerar cómo muestran sus talentos.');

  });

  it('Get default (Japanese) profile summary:', () => {
    const textSummary = new TextSummary({ locale : 'ja', 'version' : 'v2' });
    const summary = textSummary.getSummary(v2JaProfile);
    assert.equal(summary, '鋭敏なタイプであり、多少批判的なタイプであり、また独特なタイプです.\n自制心があるタイプです: 自分の欲望をコントロールできますし、強烈な欲望を持ちません. 温和なタイプです: 滅多に怒りません. また、自己主張が強いタイプです: 遠慮なく発言し、その場をリードする傾向があります。また、集団を統率できます.\n組織への帰属を意識して意思決定するタイプです.\n生活を楽しむことと成功することの両方にあまりこだわりません. 単なる個人の楽しみよりも大きな目標を伴う行動を優先します. また自分の才能を誇示することにあまり拘らず意思決定します.');

  });

});

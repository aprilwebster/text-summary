/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/*eslint no-console: */

const CIRCUMPLEX_ORDER_OF_PERSONALITY_TRAITS = 'EANOC';

const _ = require('underscore');
const extend = _.extend;
const pick = _.pick;

var format = require('./utilities/format');
var comparators = require('./utilities/comparators');

//var i18n = require('./i18n');
const I18nDataV2 = require('./i18n/v2');
const I18nDataV3 = require('./i18n/v3');
const defaultVersion = 'v2';

//const PersonalityProfileV2 = require('./utilities/profile_parsers/v2');

class TextSummary {

  constructor(options) {
    this._options = extend(this.defaultOptions(), pick(options, 'locale', 'format', 'version'));
    this._version = typeof this._options.version !== 'undefined' ? this._options.version : defaultVersion;

    console.log('version is ' + this._version);
    console.log('locale is ' + this._options.locale);

    //this._personalityProfile = new PersonalityProfileV2(profile);

    if (this._version === 'v3'){
      this._i18n = new I18nDataV3(this._options.locale);
    } else{
      this._i18n = new I18nDataV2(this._options.locale);
    }
    this._dictionary = this._i18n.data();
    this._translatorFactory = this._i18n.translatorFactory();
    this._translator = this._translatorFactory.createTranslator(this._dictionary.phrases);

    // Is this right??
    this.circumplexData = this._dictionary.traits;
    this.facetsData = this._dictionary.facets;
    this.valuesData = this._dictionary.values;
    this.needsData = this._dictionary.needs;
  }

  /*
  description(traitId) {
    return format(this._descriptions[traitId], this._options);
  }
  */

  defaultOptions() {
    return {
      locale: 'en',
      version: 'v2'
    };
  }

  getSummary(profile) {
    //console.log('DEBUG getSummary: \n' + this.assemble(profile.tree).map(function (paragraph) { return paragraph.join(' '); }).join('\n'));
    return this.assemble(profile.tree).map(function (paragraph) { return paragraph.join(' '); }).join('\n');
  }

  assemble(tree) {

    var traits = tree.children[0].children[0];
    var needs = tree.children[1].children[0];
    var values = tree.children[2].children[0];

    return [
      this.assembleTraits(traits),
      this.assembleFacets(traits),
      this.assembleNeeds(needs),
      this.assembleValues(values)
    ];
  }

  assembleTraits(personalityTree) {
    var
      sentences = [],
      big5elements = [],
      relevantBig5,
      //adj, adj1, adj2, adj3;
      adj1, adj2, adj3;

    // Sort the Big 5 based on how extreme the number is.
    //personalityTree.children[0].children.forEach(function (p) {
    personalityTree.children.forEach(function (p) {
      big5elements.push({
        id: p.id,
        percentage: p.percentage
      });
    });

    big5elements.sort(comparators.compareByRelevance);

    // Remove all traits with percentage values between 32% and 68%, as it's inside the common people.
    relevantBig5 = big5elements.filter(function (item) {
      return Math.abs(0.5 - item.percentage) > 0.18;
    });


    if (relevantBig5.length < 2) {
      // Even if no Big 5 attribute is interesting, you get 1 adjective.
      relevantBig5 = [big5elements[0], big5elements[1]];
    }

    adj1 = relevantBig5.length >=2 ? this.getCircumplexAdjective(relevantBig5[0], relevantBig5[1], 0) : null;
    adj2 = relevantBig5.length >=3 ? this.getCircumplexAdjective(relevantBig5[1], relevantBig5[2], 1) : null;
    adj3 = relevantBig5.length >=4 ? this.getCircumplexAdjective(relevantBig5[2], relevantBig5[3], 2) : null;
    //console.log('DEBUG: adjectives = ' + adj1 + ' ' + adj2 + ' ' + adj3);

    // Generate sentences summarizing personality traits
    switch (relevantBig5.length) {
    case 2:
      sentences.push(format(this._translator('You are %s'), adj1) + '.');
      break;
    case 3:
      sentences.push(format(this._translator('You are %s and %s'),  adj1, adj2) + '.');
      break;
    case 4:
    case 5:
      sentences.push(format(this._translator('You are %s, %s and %s'),  adj1, adj2, adj3) + '.');
      break;
    }

    return sentences;
  }

  assembleFacets(personalityTree) {
    var
      sentences = [],
      facetElements = [],
      info,
      i;

    // Assemble the full list of facets and sort them based on how extreme
    // is the number.
    //personalityTree.children[0].children.forEach(function (p) {
    personalityTree.children.forEach(function (p) {
      p.children.forEach(function (f) {
        facetElements.push({
          id: f.id,
          percentage: f.percentage,
          parent: p
        });
      });
    });
    facetElements.sort(comparators.compareByRelevance);

    // Assemble an adjective and description for the two most important facets.
    info = this.getFacetInfo(facetElements[0]);
    sentences.push(format(this._translator('You are %s'), info.term) + ': ' + info.description + '.');
    info = this.getFacetInfo(facetElements[1]);
    sentences.push(format(this._translator('You are %s'), info.term) + ': ' + info.description + '.');

    // If all the facets correspond to the same feature, continue until a
    // different parent feature is found.
    i = 2;
    if (facetElements[0].parent === facetElements[1].parent) {
      while (facetElements[0].parent === facetElements[i].parent) {
        i += 1;
      }
    }
    info = this.getFacetInfo(facetElements[i]);
    sentences.push(format(this._translator('And you are %s'), info.term) + ': ' + info.description + '.');

    //console.log('DEBUG: assembleFacets. ' + sentences);
    return sentences;
  }

  assembleNeeds(needsTree) {
    var
      sentences = [],
      needsList = [],
      word,
      sentence;

    //needsTree.children[0].children.forEach(function (p) {
    needsTree.children.forEach(function (p) {
      needsList.push({
        id: p.id,
        percentage: p.percentage
      });
    });
    needsList.sort(comparators.compareByValue);

    // Get the words required.
    //self.needsData[n.id]
    var need = needsList[0];
    //var word_test = (self.needsData[need.id])[0];
    //word = getWordsForNeed(needsList[0])[0];
    word = (this.needsData[need.id])[0];
    //console.log('DEBUG assembleNeeds: word_test is ' + word_test + ' and word is ' + word);

    // Form the right sentence for the single need.
    switch (this.intervalFor(needsList[0].percentage)) {
    case 0:
      sentence = this._translator('Experiences that make you feel high %s are generally unappealing to you');
      break;
    case 1:
      sentence = this._translator('Experiences that give a sense of %s hold some appeal to you');
      break;
    case 2:
      sentence = this._translator('You are motivated to seek out experiences that provide a strong feeling of %s');
      break;
    case 3:
      sentence = this._translator('Your choices are driven by a desire for %s');
      break;
    }
    sentence = format(sentence, word).concat('.');
    sentences.push(sentence);

    //console.log('DEBUG: assembleNeeds. ' + sentences);
    return sentences;
  }

  assembleValues(valuesTree) {
    var
      sentences = [],
      valuesList = [],
      info1, info2,
      sentence,
      valuesInfo,
      i, term1, term2;

    valuesTree.children.forEach(function (p) {
      valuesList.push({
        id: p.id,
        percentage: p.percentage
      });
    });
    valuesList.sort(comparators.compareByRelevance);

    // Are the two most relevant in the same quartile interval? (e.g. 0%-25%)
    //sameQI = intervalFor(valuesList[0].percentage) === intervalFor(valuesList[1].percentage);

    // Get all the text and data required.
    info1 = this.getValueInfo(valuesList[0]);
    info2 = this.getValueInfo(valuesList[1]);

    if (this.intervalFor(valuesList[0].percentage) === this.intervalFor(valuesList[1].percentage)) {
      // Assemble the first 'both' sentence.
      term1 = info1.term;
      term2 = info2.term;
      switch (this.intervalFor(valuesList[0].percentage)) {
      case 0:
        sentence = format(this._translator('You are relatively unconcerned with both %s and %s'), term1, term2) + '.';
        break;
      case 1:
        sentence = format(this._translator('You don\'t find either %s or %s to be particularly motivating for you'), term1, term2) + '.';
        break;
      case 2:
        sentence = format(this._translator('You value both %s and %s a bit'), term1, term2) + '.';
        break;
      case 3:
        sentence = format(this._translator('You consider both %s and %s to guide a large part of what you do'), term1, term2) + '.';
        break;
      }
      sentences.push(sentence);

      // Assemble the final strings in the correct format.
      sentences.push(info1.description + '.');
      sentences.push(format(this._translator('And %s'), info2.description.toLowerCase()) + '.');
    } else {
      valuesInfo = [info1, info2];
      for (i = 0; i < valuesInfo.length; i += 1) {
        // Process it this way because the code is the same.
        switch (this.intervalFor(valuesList[i].percentage)) {
        case 0:
          sentence = format(this._translator('You are relatively unconcerned with %s'), valuesInfo[i].term);
          break;
        case 1:
          sentence = format(this._translator('You don\'t find %s to be particularly motivating for you'), valuesInfo[i].term);
          break;
        case 2:
          sentence = format(this._translator('You value %s a bit more'),  valuesInfo[i].term);
          break;
        case 3:
          sentence = format(this._translator('You consider %s to guide a large part of what you do'),  valuesInfo[i].term);
          break;
        }
        sentence = sentence.concat(': ').
            concat(valuesInfo[i].description.toLowerCase()).
            concat('.');
        sentences.push(sentence);
      }
    }
    //console.log('DEBUG: assembleValues. ' + sentences);
    return sentences;
  }

  /**
  *  p1 and p2 are personality traits of the form {"id":<id>,"percentage":<percentage>}
  *  getCircumplexAdjective returns an ordering of the traits that are consistent with X.
  */
  getCircumplexAdjective(p1, p2, order) {

    //console.log('DEBUG: p1 is ' + JSON.stringify(p1,2,null));
    //console.log('DEBUG: p2 is ' + JSON.stringify(p2,2,null));

    var ordered = [p1, p2].sort(function (o1, o2) {
      var
        i1 = CIRCUMPLEX_ORDER_OF_PERSONALITY_TRAITS.indexOf(o1.id.charAt(0)),
        i2 = CIRCUMPLEX_ORDER_OF_PERSONALITY_TRAITS.indexOf(o2.id.charAt(0));

      return i1 < i2 ? -1 : 1;
    });
      // Assemble the identifier as the JSON file stored it.
      // AW: V2 - percentage and id, V3 - percentile and trait_id
    var identifier = ordered[0].id.
        concat(ordered[0].percentage > 0.5 ? '_plus_' : '_minus_').
        concat(ordered[1].id).
        concat(ordered[1].percentage > 0.5 ? '_plus' : '_minus');

    var traitMult = this.circumplexData[identifier][0];
    var sentence = '%s';

    //console.log('identifier is ' + identifier);
    //console.log('traitMult is ' + traitMult);
    //console.log('sentence is ' + sentence);

    if (traitMult.perceived_negatively) {
      switch (order) {
      case 0:
        sentence = this._translator('a bit %s');
        break;
      case 1:
        sentence = this._translator('somewhat %s');
        break;
      case 2:
        sentence = this._translator('can be perceived as %s');
        break;
      }
    }
    //console.log('DEBUG: %s is ' + sentence);
    //console.log('DEBUG: sentence is ' + sentence);
    //console.log('DEBUG: traitMult.word is ' + traitMult.word);
    //console.log(tphrase('a bit %s'));
    return format(sentence, traitMult.word);
  }

  getValueInfo(v) {
    var data = this.valuesData[v.id.replace(/[_ ]/g, '-')][0];

    return {
      name: v.id,
      term: this.valuesData[v.id.replace(/[_ ]/g, '-')][0].Term.toLowerCase(),
      description: v.percentage > 0.5 ? data.HighDescription : data.LowDescription
    };
  }

  getFacetInfo(f) {
    var
      data = this.facetsData[f.id.replace('_', '-').replace(' ', '-')],
      t, d;

    if (f.percentage > 0.5) {
      t = data.HighTerm.toLowerCase();
      d = data.HighDescription.toLowerCase();
    } else {
      t = data.LowTerm.toLowerCase();
      d = data.LowDescription.toLowerCase();
    }

    return {
      name: f.id,
      term: t,
      description: d
    };
  }

  intervalFor(p) {
    return Math.min(Math.floor(p * 4), 3);
  }

}

module.exports = TextSummary;

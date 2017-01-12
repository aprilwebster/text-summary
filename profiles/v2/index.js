/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
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

class PersonalityProfile {

  constructor(profile) {
    this._traits = profile.tree.children[0].children[0].children;
    this._needs = profile.tree.children[1].children[0];
    this._values = profile.tree.children[2].children[0];
  }

  traits(){
    var traitsList = [];
    this._traits.forEach(function (t) {

      var facetsList = [];
      t.children.forEach(function (facet) {
        facetsList.push({
          'id': facet.id,
          'name': facet.name,
          'category': facet.category,
          'score': facet.percentage
        });
      });

      var trait = {
        'id': t.id,
        'name': t.name,
        'category': t.category,
        'score': t.percentage,
        'facets': facetsList
      };
      traitsList.push(trait);
    });

    return traitsList;
  }

  needs() {
    var needsList = [];
    this._needs.forEach(function (n) {
      var trait = {
        'id': n.id,
        'name': n.name,
        'category': n.category,
        'score': n.percentage,
      };
      needsList.push(trait);
    });

    return needsList;
  }

  values() {
    var valuesList = [];
    this._values.forEach(function (v) {
      var trait = {
        'id': v.id,
        'name': v.name,
        'category': v.category,
        'score': v.percentage,
      };
      valuesList.push(trait);
    });

    return valuesList;
  }
}

module.exports = PersonalityProfile;

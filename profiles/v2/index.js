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
    //console.log(JSON.stringify(profile,2,null));
    this._traits = profile.tree.children[0].children;
    this._needs = profile.tree.children[1].children[0];
    this._values = profile.tree.children[2].children[0];
  }

  traits() {
    return this._traits;
  }

  needs() {
    return this._needs;
  }

  values() {
    return this._values;
  }
}

module.exports = PersonalityProfile;

// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const BaseGenerator = require('../../lib/base-generator');
const g = require('../../lib/globalize');
const open = require('open');
const chalk = require('chalk');

module.exports = class UpdateGenerator extends BaseGenerator {
  // Note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);
    this.command = 'update';
  }

  _setupGenerator() {
    this.option('semver', {
      type: Boolean,
      required: false,
      default: false,
      description: g.f('Check version compatibility using semver semantics'),
    });
    return super._setupGenerator();
  }

  setOptions() {
    return super.setOptions();
  }

  async checkLoopBackProject() {
    if (this.shouldExit()) return;
    this.updated = await super.checkLoopBackProject();
  }

  async _openChangeLog() {
    if (this.shouldExit()) return;
    if (this.updated !== true) return;
    this.log(chalk.red('The upgrade may break the current project.'));
    const prompts = [
      {
        type: 'confirm',
        name: 'openChangeLog',
        message: g.f(
          `Do you want to check out changes between LoopBack releases?`,
        ),
        default: true,
        when: this.updated === true,
      },
    ];
    const answers = await this.prompt(prompts);
    if (answers && answers.openChangeLog) {
      await open('https://loopback.io/doc/en/lb4/changelog.index.html');
    }
  }

  async end() {
    await this._openChangeLog();
    await super.end();
  }
};

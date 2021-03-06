// Copyright 2014 Technical Machine, Inc. See the COPYRIGHT
// file at the top-level directory of this distribution.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

var fs = require('fs')
  , path = require('path')
  , logs = require('../src/logs')
  ;

var tessel = require('./')


/**
 * CLI modes
 */

function basic ()
{
  require('colors');
  require('colorsafeconsole')(console);
}

function repeatstr (str, n) {
  return Array(n + 1).join(str);
}

var header = {
  init: function () {
    header._msg('TESSEL? '.grey);
  },
  _unwrite: function (n) {
    process.stderr.write(repeatstr('\b', n));
    header.len = 0;
  },
  _msg: function (str) {
    header._unwrite(header.len || 0);
    header.len = str.stripColors.length;
    process.stderr.write(str);
  },
  nofound: function () {
    header._msg('TESSEL? No Tessel found, waiting...'.grey);
  },
  connected: function (serialNumber) {
    header._msg('TESSEL!'.bold.cyan + ' Connected to '.cyan + ("" + serialNumber).green + '.\n'.cyan);
  }
}

function controller (stop, next)
{
  header.init();

  if (typeof stop === 'function' && typeof next === 'undefined') {
    next = stop;
    stop = false;
  }

  tessel.findTessel(null, stop, function (err, client) {
    if (!client || err) {
      logs.err(err);
      process.exit(1);
    }

    header.connected(client.serialNumber);

    next(null, client);
  });
}

exports.basic = basic;
exports.controller = controller;
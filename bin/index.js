#!/usr/bin/env node

const PillTong = require('../lib/pill-tong');
const _ = require('lodash');

/**
 * option parser
 * 
 * scheme:
 * --<name> <value>
 * 
 * example:
 * pilltong --conf ./pill-tong.yml
 */
const optionParser = _.flowRight(
  _.partial(_.reduce, _, (r, v) => _.set(r, v[0].replace(/-/g, ''), v[1]), { }),
  _.partial(_.chunk, _, 2),
);

// create the pilltong module
PillTong.create(optionParser(process.argv.slice(2)));

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
  _.partial(_.reduce, _, (r, [k, v]) => _.set(r, k, v || true), { }),
  _.partial(_.map, _, (v) => v.split(' ')),
  _.partial(_.slice, _, 1),
  _.partial(_.split, _, /[\s]*--[\s]*/),
  _.partial(_.join, _, ' '),
);

// create the pilltong module
PillTong.create(optionParser(process.argv.slice(2)));

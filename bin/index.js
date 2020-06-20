#!/usr/bin/env node

const PillTong = require('../lib/pill-tong');

PillTong.create(
    process.argv
        .slice(2)
);

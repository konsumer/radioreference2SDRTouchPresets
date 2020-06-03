#!/usr/bin/env node

const { getFrequencies } = require('./getFrequencies')

if (process.argv.length !== 3) {
  console.error('Usage: radioreference2SDRTouchPresets <ZIPCODE>')
  process.exit(1)
}

getFrequencies(process.argv[2]).then(console.log)

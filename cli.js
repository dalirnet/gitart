#!/usr/bin/env node
import _ from 'lodash'
import yargs from 'yargs'
import gitart from './src/index.js'
import { hideBin } from 'yargs/helpers'

/* Init Args */
const args = yargs(hideBin(process.argv)).argv
const text = _.get(args, '_.0')
const year = _.get(args, 'yaer', _.get(args, 'y'))
const cpd = _.get(args, 'cpd', _.get(args, 'c'))

/* Call gitart */
gitart(text, year, cpd)
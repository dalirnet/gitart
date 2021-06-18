import _ from 'lodash'
import chars from './chars.js'

const validation = (text, year, cpd) =>
    _({ text, year, cpd })
        .tap((input) => {
            /* Text validate */
            input.text = _(input.text)
                .thru((i) => {
                    return _.trim(i) || 'gitart'
                })
                .thru((i) => {
                    /* Convert multi space to single space */
                    return _.replace(i, /\s\s+/g, ' ')
                })
                .thru((i) => {
                    /* Remove invalid chars */
                    return _.replace(i, new RegExp('[^' + _.join(_.keys(chars), '') + ']', 'ig'), '')
                })
                .thru((i) => {
                    // return _.truncate(i, {
                    //     'length': 24,
                    //     'separator': ' '
                    //   })
                    return i
                })
                .thru((i) => {
                    return _.upperCase(i)
                })
                .value()
        })
        .tap((input) => {
            /* Year validate */
            input.year = _(input.year)
                .thru((i) => {
                    return _.toSafeInteger(i)
                })
                .thru((i) => {
                    /* Limit year */
                    return _.clamp(i, 2000, 2020)
                })
                .value()
        })
        .tap((input) => {
            /* Commit per day validate (cpd) */
            input.cpd = _(input.cpd)
                .thru((i) => {
                    return _.toSafeInteger(i)
                })
                .thru((i) => {
                    /* Limit year */
                    return _.clamp(i, 1, 20)
                })
                .value()
        })
        .value()

export default validation

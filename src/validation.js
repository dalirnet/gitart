import _ from 'lodash'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc.js'
import dayjsWeekday from 'dayjs/plugin/weekday.js'
import chars from './chars.js'

/* 
Add dayjs plugin
*/
dayjs.extend(dayjsUtc)
dayjs.extend(dayjsWeekday)

/* 
    Validation object
*/
const validation = (text, year, cpd) => {
    return _({ text, year, cpd })
        .tap((input) => {
            /* 
                Text validate
            */
            input.text = _(input.text)
                .thru((value) => {
                    return _.trim(value) || 'gitart'
                })
                .thru((value) => {
                    /*
                        Convert multi space to single space
                    */
                    return _.replace(value, /\s\s+/g, ' ')
                })
                .thru((value) => {
                    /*
                        Remove unsupported chars
                    */
                    return _.replace(value, new RegExp('[^' + _.join(_.keys(chars), '') + ']', 'ig'), '')
                })
                .thru((value) => {
                    /*
                        Inject between space
                    */
                    return _.join(_.split(_.toUpper(value), ''), ' ')
                })
                .thru((value) => {
                    /*
                        Normalize space
                    */
                    return _.replace(value, /\s\s+/g, '  ')
                })
                .thru((value) => {
                    /*
                        Truncate text
                    */
                    return _.reduce(
                        _.split(value, ''),
                        (keep, char) => {
                            if (!keep.break) {
                                const currentCharLen = _.get(chars, [char, 'len'])
                                if (keep.week + currentCharLen < 50) {
                                    keep.value += char
                                    keep.week += currentCharLen
                                } else {
                                    keep.value += '...'
                                    keep.week += 3
                                    keep.break = true
                                }
                            }

                            return keep
                        },
                        { value: '', week: 1, break: false }
                    )
                })
                .thru(({ value }) => {
                    /*
                        Calculate matrix
                    */
                    return {
                        original: value,
                        matrix: _.reduce(
                            _.split(value, ''),
                            (keep, char) => {
                                /*
                                    Original matrix (per row)
                                */
                                const currentChar = _.get(chars, char)
                                return _.reduce(
                                    _.range(currentChar.len),
                                    (Keeped, index) => {
                                        /*
                                            Switched matrix (per column)
                                        */
                                        Keeped.push(
                                            _.map(_.map(currentChar.matrix, index), (state) => {
                                                return _.toSafeInteger(state === '#')
                                            })
                                        )
                                        return Keeped
                                    },
                                    keep
                                )
                            },
                            []
                        ),
                    }
                })
                .tap((value) => {
                    /*
                        Add flatted matrix
                    */
                    value.matrix = {
                        original: value.matrix,
                        flatted: _.flatten(value.matrix),
                    }
                })
                .value()
        })
        .tap((input) => {
            /* 
                Year validate
            */
            input.year = _(input.year)
                .thru((value) => {
                    return _.toSafeInteger(value)
                })
                .thru((value) => {
                    /*
                        Limit value
                    */
                    return _.clamp(value, 2000, 2020)
                })
                .thru((value) => {
                    /*
                        Calculate date of year
                    */
                    return {
                        original: value,
                        firstDay: dayjs.utc(_.toString(value)),
                        lastDay: dayjs.utc(_.toString(value)).endOf('year').startOf('day'),
                    }
                })
                .thru((value) => {
                    /*
                        Calculate matrix bound from calculated date
                    */
                    return {
                        original: value.original,
                        from: value.firstDay.add(7 - value.firstDay.day(), 'day'),
                        to: value.lastDay.subtract(value.lastDay.day() + 1, 'day'),
                    }
                })
                .value()
        })
        .tap((input) => {
            /* 
                Commit per day validate (cpd)
            */
            input.cpd = _(input.cpd)
                .thru((i) => {
                    return _.toSafeInteger(i)
                })
                .thru((i) => {
                    /*
                        Limit value
                    */
                    return _.clamp(i, 1, 20)
                })
                .value()
        })
        .value()
}

export default validation

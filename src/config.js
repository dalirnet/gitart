import _ from 'lodash'
import path from 'path'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc.js'

/*
    Load chars
*/
import chars from './chars.js'

/* 
    Add dayjs plugin
*/
dayjs.extend(dayjsUtc)

/* 
    Config object
*/
export default (text, year, gap, cpd) => {
    return _({ text, year, gap, cpd })
        .tap((input) => {
            /* 
                Gap config
            */
            input.gap = _(input.gap)
                .thru((value) => {
                    return _.toSafeInteger(value)
                })
                .thru((value) => {
                    /*
                        Limit value
                    */
                    return _.clamp(value, 1, 45)
                })
                .value()
        })
        .tap((input) => {
            /* 
                Text config
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
                                    keep.value += '  .'
                                    keep.week += 3
                                    keep.break = true
                                }
                            }

                            return keep
                        },
                        {
                            value: '',
                            week: input.gap,
                            break: false,
                        }
                    )
                })
                .thru(({ value }) => {
                    /*
                        Calculate matrix
                    */
                    return {
                        original: value,
                        cleaned: _.replace(value, /([^\s])\s/g, '$1'),
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
                Year config
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
                Commit per day config (cpd)
            */
            input.cpd = _(input.cpd)
                .thru((value) => {
                    return _.toSafeInteger(value)
                })
                .thru((value) => {
                    /*
                        Limit value
                    */
                    return _.clamp(value, 1, 9)
                })
                .value()
        })
        .tap((input) => {
            /* 
                Add project path
            */
            input.path = path.join(path.resolve('GitArts'), 'GitArt' + input.year.original)
        })
        .value()
}

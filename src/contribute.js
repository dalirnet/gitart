import _ from 'lodash'

/*
    Contribute object
*/
export default (matrix, date, gap, cpd) => {
    return _.reduce(
        matrix,
        (contribute, state, index) => {
            if (state) {
                _.set(
                    contribute,
                    date
                        .add(index + gap * 7, 'day')
                        .hour(12)
                        .toString(),
                    _.range(cpd * state)
                )
            }
            return contribute
        },
        {}
    )
}

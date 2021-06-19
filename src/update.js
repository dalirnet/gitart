import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'

export default (project) => {
    /*
        Change file
    */
    const update = (content) => {
        return fs
            .outputFile(path.join(project, 'readme.md'), content, {
                flag: 'a',
            })
            .then(() => {
                return _.trim(content)
            })
    }

    return {
        title() {
            return update('# GitArt' + '\n')
        },
        head(value) {
            return update('\n\n' + '##### ' + value + '\n')
        },
        list(index) {
            return update(index + 1 + '. Auto commit.' + '\n')
        },
    }
}

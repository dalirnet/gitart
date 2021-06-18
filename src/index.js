import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import simpleGit from 'simple-git'
import validation from './validation.js'

const gitart = (text, year, cpd) => {
    /*
        Validation inputs
    */
    const validated = validation(text, year, cpd)

    /*
        Computing activityes (date and commits)
    */
    const computedActivityes = _.reduce(
        validated.text.matrix.flatted,
        (activities, activity, index) => {
            if (activity) {
                activities.push({
                    date: validated.year.from.add(index, 'day').hour(12).toString(),
                    commits: _.map(Array(validated.cpd * activity), (value, key) => {
                        return 'Auto commit [' + (key + 1) + '] by GitArt.'
                    }),
                })
            }

            return activities
        },
        []
    )

    /*
        Start project
    */
    const project = () => {
        return _({ path: { root: path.resolve('dist') } })
            .tap((config) => {
                /*
                    Initial config
                */
                config.path.project = path.join(config.path.root, 'GitArt' + validated.year.original)
            })
            .thru((config) => {
                /*
                    Init project
                */
                fs.removeSync(config.path.project)
                fs.ensureDirSync(config.path.project)
                return {
                    ...config,
                    git: simpleGit(config.path.project),
                }
            })
            .thru((config) => {
                /*
                    Init git
                */
                return config.git
                    .init()
                    .then(() => {
                        return fs.outputFile(path.join(config.path.project, 'readme.md'), '# GitArt')
                    })
                    .then(() => {
                        return config.git.add('readme.md')
                    })
                    .then(() => {
                        return config
                    })
            })
            .value()
    }

    project()
        .then((r) => {
            console.log(r)
        })
        .catch(({ message }) => {
            console.log(message)
        })
}

export default gitart

import _ from 'lodash'
import ora from 'ora'

/*
    Loaders
*/
import loadConfig from './src/config.js'
import loadContribute from './src/contribute.js'
import loadGit from './src/git.js'
import loadUpdate from './src/update.js'
import loadCommit from './src/commit.js'

/*
    GitArt function
*/
export default (text, year, gap, cpd) => {
    const loading = ora('Loading ...').start()

    try {
        /*
            Load config
        */
        const config = loadConfig(text, year, gap, cpd)

        /*
            Load contribute
        */
        const contribute = loadContribute(config.text.matrix.flatted, config.year.from, config.gap, config.cpd)

        /*
            Load git
        */
        loadGit(config.path).then(async (git) => {
            let generated = 0
            for (let date in contribute) {
                await loadUpdate(config.path)
                    .head(date)
                    .then(async () => {
                        for (let index of contribute[date]) {
                            await loadUpdate(config.path)
                                .list(index)
                                .then((message) => {
                                    return loadCommit(git, date, message)
                                })
                        }
                    })
                loading.text = 'Generating ' + _.floor(_.clamp((_.size(contribute) * generated++) / 100, 1, 100)) + '% ...'
            }
            loading.succeed('Generated "' + config.text.cleaned + '" at ' + config.path)
        })
    } catch ({ message }) {
        loading.fail(message)
    }
}

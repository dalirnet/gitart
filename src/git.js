import _ from 'lodash'
import fs from 'fs-extra'
import simpleGit from 'simple-git'

/*
    Loaders
*/
import loadUpdate from './update.js'

export default (path) => {
    /*
        Initial folder
    */
    fs.removeSync(path)
    fs.ensureDirSync(path)

    /*
        Initial git
    */
    const git = simpleGit(path)

    /*
        Initial file
    */
    return loadUpdate(path)
        .title()
        .then(() => {
            return git.init()
        })
        .then(() => {
            return git
        })
}

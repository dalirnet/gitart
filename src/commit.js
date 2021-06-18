export default (git, date, message) => {
    /*
        Commit change
    */
    return git.add('readme.md').then(() => {
        return git.commit('"' + message + '"', {
            '--date': '"' + date + '"',
        })
    })
}

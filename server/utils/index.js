const createMsg = (user, message) => {
    return {
        user,
        message,
        date: new Date().getTime()
    }
}

module.exports = {
    createMsg
}
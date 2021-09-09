function getUserByEmail(email, users) {
    for (let userId in users) {
        let user = users[userId];
        if (user.email == email) {
            return user;
        }
    }
    return null;
}

module.exports = { getUserByEmail };
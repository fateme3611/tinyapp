function urlsForUser(id, urlDatabase) {
    const res = {};
    for (let urlId in urlDatabase) {
        if (urlDatabase[urlId].userID == id) {
            res[urlId] = urlDatabase[urlId];
        }
    }

    return res;
}


module.exports = urlsForUser;
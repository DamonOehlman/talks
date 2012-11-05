getTweetsFor("domenic") // promise-returning async function
    .then(function (tweets) {
        var shortUrls = parseTweetsForUrls(tweets);
        var mostRecentShortUrl = shortUrls[0];
        return expandUrlUsingTwitterApi(mostRecentShortUrl); // promise-returning async function
    })
    .then(doHttpRequest) // promise-returning async function
    .then(
        function (responseBody) {
            console.log("Most recent link text:", responseBody);
        },
        function (error) {
            console.error("Error with the twitterverse:", error);
        }
    );
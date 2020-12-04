
function randomEosioName(length){
    var result = '';
    var validCharacters = "12345abcdefghijklmnopqrstuvxyz"
    for(let i = 0; i < length; i++){
        result += validCharacters.charAt(Math.floor(Math.random() * validCharacters.length))
    }
    return result;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    randomEosioName: randomEosioName,
    sleep: sleep,
};
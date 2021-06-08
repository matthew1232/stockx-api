module.exports = (body) => {
    try {
        return JSON.parse(body);
    }
    catch(err){
        throw new Error("Failed to parse JSON " + body);
    }
}
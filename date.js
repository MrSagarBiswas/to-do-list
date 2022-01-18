exports.getDate = function (){
    const today = new Date();
    const options = {
        day: "2-digit",
        year: "numeric",
        month: "long",
        weekday: "long"
    }
    return today.toLocaleDateString("en-IN", options);
}

exports.getDay = function (){
    const today = new Date();
    const options = {
        weekday: "long"
    }
    return today.toLocaleDateString("en-IN", options);
}
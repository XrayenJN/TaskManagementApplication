export function isExpired(date){
    const givendate = new Date(date)
    const todayDate = new Date();
    if (todayDate > givendate){
        return true
    }
    return false
}
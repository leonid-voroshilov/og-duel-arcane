export function getRandomInt(min = 0, max = 9) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}
function shouldReroll(val, reroll0 = true, reroll9 = false, reroll8 = false) {
    val = val === 0 ? 10 : val
    return (val >= 8 && reroll8) || (reroll9 && val >= 9) || (reroll0 && val >= 10)
}
function isSuccess(val, isLuckyDie = false) {
    const successRate = isLuckyDie ? 10 : 8
    if (val === 0) val = 10
    return val >= successRate
}

export default function GetRoll(n = 1, reroll0 = true, reroll9 = false, reroll8 = false) {
    var res = "";
    var isLuckyDie = false
    if (n <= 0) {
        isLuckyDie = true
        reroll0 = false
        reroll9 = false
        reroll8 = false 
        n = 1
    }

    var count_reroll = 0
    var count_1 = 0
    var count_succ = 0
    var cur_val;
    for (var i = n; i > 0; i--) {
        cur_val = getRandomInt();
        res += ` ${cur_val} `
        if (cur_val === 1)
            count_1++

        count_reroll += shouldReroll(cur_val, reroll0, reroll9, reroll8) ? 1 : 0
        count_succ += isSuccess(cur_val, isLuckyDie) ? 1 : 0

        if (i === 1 && count_reroll > 0) {
            i += count_reroll
            count_reroll = 0
            res += ":"
        }
    }
    var result = {};
    result.status = count_succ > 0 ?  count_succ >= count_1 ? "Success" : "Botch" : count_1 > 0 ? "Botch" : "Unsuccess"    
    result.val = result.status === "Success" ? count_succ :  result.status === "Botch" ? -1 * count_1 : 0;
    result.str = res
    result.isLuckyDie = isLuckyDie
    return result
}


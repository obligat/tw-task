let moment = require('moment');

let today = moment().format('YYYY-MM-DD');

let userInput = [];
let output = [{A: []}, {B: []}, {C: []}, {D: []}];

function isValidDate(date) {

    let bool = moment(date).isSame(today) || moment(date).isAfter(today);
    return bool ? true : false;
}

function isWeekDay() {

    let day = moment().weekday();
    return (day === 0 || day === 6) ? true : false;
}

function isValidUserId(string) {
    let reg = /(^U\d+$)/g;
    return reg.test(string);
}

function testTimeFragment(string) {
    let reg = /^(\d+):00~(\d+):00$/g;

    if (reg.test(string)) {
        let arr = string.split('~'), start = arr[0],
            end = arr[1];
        start = parseInt(start.split(':')[0]);
        end = parseInt(end.split(':')[0]);

        if (start < 9 || start === end) {
            return false;
        } else {
            return [start, end];
        }

    } else {
        return false;
    }

}

function testSite(string) {
    let reg = /^[ABCD]$/g;
    if (reg.test(string)) {
        return string;
    } else {
        return false;
    }
}

function checkInput(string) {

    if (string === '\n') {
        return;
    }

    let str = string.trim();
    let arr = str.split(' ');
    let bool = isWeekDay();

    if (arr.length === 4) {

        if (isValidUserId(arr[0]) && isValidDate(arr[1]) && testTimeFragment(arr[2]) && testSite(arr[3])) {

            let timeFrag = testTimeFragment(arr[2]);

            for (let i = 0; i < userInput.length; i++) {
                let isExistDate = userInput[i].indexOf(arr[1]);
                let isSameSite = userInput[i].indexOf(arr[3]);

                if (userInput[i].split(' ').length === 5) {
                    break;
                }

                if (~isExistDate && ~isSameSite) {

                    let existTimeFrag = testTimeFragment(userInput[i].split(' ')[2]);

                    if (!(timeFrag[1] <= existTimeFrag[0] || timeFrag[0] >= existTimeFrag[1])) {

                        return 'Error: the booking conflicts with existing bookings!'
                    }
                }
            }


            let money = calcuMoney(...testTimeFragment(arr[2]), bool);
            let outputStr = [arr[1], arr[2], money + '元'].join(' ');
            output.forEach(item =>{
                let key = Object.keys(item)[0];
                if (key === arr[3]) {
                    item[key].push(outputStr);
                }
            });

            userInput.push(string);

            return 'Success: the booking is accepted!';
        } else {
            return 'Error: the booking is invalid!'
        }
    } else if (arr.length === 5 && arr[4] === 'C') {

        let isCanceled = userInput.find(item => item === string);
        if (isCanceled) {
            return 'Error: the booking being cancelled does not exist!';
        }

        let oldStr = string.slice(0, -2);
        let oldSite = arr[3];
        let isFind = userInput.indexOf(oldStr);

        if (~isFind) {
            userInput[isFind] = string;

            output.forEach(item => {
                let key = Object.keys(item)[0];

                if (key === oldSite) {
                    let replacedItemIndex = item[key].map((i, index) => {
                        let cancel = i.indexOf([arr[1], arr[2]].join(' '));
                        if (~cancel) {
                            return index;
                        }
                    }).find(k => k);

                    let fee = calcuMoney(...testTimeFragment(arr[2]), bool);

                    if (bool) {
                        fee = fee * 0.25;
                    } else {
                        fee = fee * 0.5;
                    }

                    replacedItemIndex = replacedItemIndex || 0;
                    item[key][replacedItemIndex] = [arr[1], arr[2], '违约金', fee + '元'].join(' ');
                }
            });

            return 'Success: the booking is accepted!'
        } else {
            return 'Error: the booking is invalid!'
        }
    } else {
        return 'Error: the booking is invalid!'
    }
}

function calcuMoney(start, end, isWeekDay) {
    let count = end - start;
    let remainder = count;
    let money = 0;
    if (!isWeekDay) {
        switch (true) {

            case (start >= 9 && start < 12):

                if (count <= 3 && end < 12) {
                    money = count * 30;
                    break;
                }

                money = (12 - start) * 30;
                remainder = count - (12 - start);

            case (start >= 12 && start < 18):

                if (remainder <= 6 && end < 18) {
                    money += remainder * 50;
                    break;
                }

                if (!(start >= 12 && start < 18)) {
                    start = 12;
                    count = end - start;
                    if (count <= 6) {
                        money += (18 - start) * 50;
                        break;
                    } else {
                        money += (18 - start) * 50;
                    }
                } else {
                    money += (18 - start) * 50;
                }
                remainder = count - (18 - start);

            case (start >= 18 && start < 20):

                if (remainder <= 2 && end < 20) {
                    money += remainder * 80;
                    break;
                }
                if (!(start >= 18 && start < 20)) {
                    start = 18;
                    count = end - start;
                    if (count <= 2) {
                        money += (20 - start) * 80;
                    } else {
                        money += (20 - start) * 80;
                    }
                } else {
                    money += (20 - start) * 80;
                }
                remainder = count - (20 - start);

            case (start >= 20 && start < 22):

                if (remainder <= 2) {
                    money += remainder * 60;
                    break;
                }
        }
    } else {
        switch (true) {

            case (start >= 9 && start < 12):

                if (count <= 3 && end < 12) {
                    money = count * 40;
                    break;
                }

                money = (12 - start) * 40;
                remainder = count - (12 - start);

            case (start >= 12 && start < 18):

                if (remainder <= 6 && end < 18) {
                    money += remainder * 50;
                    break;
                }

                if (!(start >= 12 && start < 18)) {
                    start = 12;
                    count = end - start;
                    if (count <= 6) {
                        money += (18 - start) * 50;
                        break;
                    } else {
                        money += (18 - start) * 50;
                    }
                } else {
                    money += (18 - start) * 50;
                }
                remainder = count - (18 - start);

            case (start >= 18 && start < 22):

                if (remainder <= 4) {
                    money += remainder * 60;
                    break;
                }
        }
    }

    return money;
}

function calcuTotalMoney(output) {
    let totalMoney = 0;
    let reg = / (\d+)元$/;

    output.forEach(function (item) {
        let key = Object.keys(item)[0];
        item['total' + key] = 0;
        item[key].forEach(i => {
            let result = reg.exec(i);
            item['total' + key] += parseInt(result[1]);
        });

        totalMoney += item['total' + key];
    });

    return totalMoney;
}

function sortOutput(output) {
    output.forEach(item => {
        let key = Object.keys(item)[0];
        item[key].sort((a, b) => {

            let aArr = a.split(' '),
                bArr = b.split(' ');
            let aTime = aArr[0],
                bTime = bArr[0];
            let isAfter = moment(aTime).isAfter(bTime);
            let isSame = moment(aTime).isSame(bTime);
            if (isSame) {
                return testTimeFragment(aArr[1])[0] >= testTimeFragment(bArr[1][0]);
            }

            return isAfter;

        });

    });

    return output;
}


function formatOutput(output) {
    let str = '\n> 收入汇总\n';
    str += '> ---\n';
    output = sortOutput(output);
    output.forEach(item => {
        let key = Object.keys(item)[0];
        str += '> 场地:' + key + '\n';

        item[key].forEach(i => {
            str += '> ' + i + '\n';
        });
        if (key === 'D') {
            str += '> 小计: ' + item['total' + key] + '元\n';
        } else {
            str += '> 小计: ' + item['total' + key] + '元\n>\n';
        }
    });

    str += '> ---\n';
    str += '> 总计: ' + calcuTotalMoney(output) + '元';
    return str;
}

function resetOutput() {
    userInput = [];
    return output = [{A: []}, {B: []}, {C: []}, {D: []}];
}

module.exports = {
    output,
    isValidDate,
    isValidUserId,
    testTimeFragment,
    testSite,
    calcuMoney,
    calcuTotalMoney,
    checkInput,
    formatOutput,
    resetOutput
};
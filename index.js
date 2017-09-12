var moment = require('moment');

var today = moment().format('YYYY-MM-DD');

var userInput = [];
var output = [{ A: [] }, { B: [] }, { C: [] }, { D: [] }];

function isValidDate(date) {
    if (moment(date).isSame(today) || moment(date).isAfter(today)) {
        return true;
    } else {
        return false;
    }
}

function isWeekDay() {
    var day = moment().weekday();
    if (day == 0 || day == 6) {
        return true;
    } else {
        return false;
    }
}

function isValidUserId(string) {
    var reg = /(^U\d+$)/g;
    return reg.test(string);
}

function testTimeFragment(string) {
    var reg = /^(\d+):00~(\d+):00$/g;

    if (reg.test(string)) {
        var arr = string.split('~');
        var start = arr[0],
            end = arr[1];
        start = parseInt(start.split(':')[0]);
        end = parseInt(end.split(':')[0]);

        if (start < 9 || start == end) {
            return false;
        } else {
            return [start, end];
        }

    } else {
        return false;
    }

}

function testSite(string) {
    var reg = /^[ABCD]$/g;
    if (reg.test(string)) {
        return string;
    } else {
        return false;
    }
}

function checkInput(string) {

    if (string == '\n') {
        return;
    }

    var str = string.trim();
    var arr = str.split(' ');
    var bool = isWeekDay();

    if (arr.length === 4) {
        if (isValidUserId(arr[0]) && isValidDate(arr[1]) && testTimeFragment(arr[2]) && testSite(arr[3])) {

            var timeFrag = testTimeFragment(arr[2]);

            for(var i = 0; i<userInput.length;i++){
                var isExistDate = userInput[i].indexOf(arr[1]);
                var isSameSite = userInput[i].indexOf(arr[3]);

                if(~isExistDate && ~isSameSite){

                    var existTimeFrag = testTimeFragment(userInput[i].split(' ')[2]);

                    if(!(timeFrag[1] <= existTimeFrag[0] || timeFrag[0] >= existTimeFrag[1]) ){

                        return 'Error: the booking conflicts with existing bookings!'
                    }
                }
            }


            var money = calcuMoney(...testTimeFragment(arr[2]), bool);
            var outputStr = [arr[1], arr[2], money + '元'].join(' ');
            output.forEach(function(item) {
                var key = Object.keys(item)[0];
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

        var isCanceled = userInput.find(item=>item === string);
        if(isCanceled){
            return 'Error: the booking being cancelled does not exist!';
        }

        var oldStr = string.slice(0, -2);
        var oldSite = arr[3];
        var isFind = userInput.indexOf(oldStr);

        if (~isFind) {
            userInput[isFind] = string;

            output.forEach(function(item) {
                var key = Object.keys(item)[0];

                if (key === oldSite) {
                    var replacedItemIndex = item[key].map(function(i, index) {
                        var cancel = i.indexOf([arr[1], arr[2]].join(' '));
                        if (~cancel) {
                            return index;
                        }
                    }).find(k => k);

                    var fee = calcuMoney(...testTimeFragment(arr[2]), bool);

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
    var count = end - start;
    var remainder = count;
    var money = 0;
    if (!isWeekDay) {
        switch (true) {

            case (start >= 9 && start < 12):

                if (count <= 3 && end < 12) {
                    money = count * 30;
                    break;
                }

                money = (12 - start) * 30;
                remainder = count - (12 - start);

            case start >= 12 && start < 18:

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

            case start >= 18 && start < 20:

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

            case start >= 20 && start < 22:

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

            case start >= 12 && start < 18:

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

            case start >= 18 && start < 22:

                if (remainder <= 4) {
                    money += remainder * 60;
                    break;
                }
        }
    }

    return money;
}

function calcuTotalMoney(output) {
    var totalMoney = 0;
    var reg = / (\d+)元$/;

    output.forEach(function(item) {
        var key = Object.keys(item)[0];
        item['total' + key] = 0;
        item[key].forEach(function(i) {
            var result = reg.exec(i);
            item['total' + key] += parseInt(result[1]);
        });

        totalMoney += item['total' + key];
    });

    return totalMoney;
}

output.forEach(item => {
    var key = Object.keys(item)[0];
    item[key].sort((a, b) => {
        var aArr = a.split(' '),
            bArr = b.split(' ');
        var aTime = aArr[0],
            bTime = bArr[0];
        var isBefore = moment(aTime).isBefore(bTime);
        if(isBefore){
            return isBefore;
        }else if(moment(aTime).isBefore(bTime)){
            return testTimeFragment(aArr[1])[0] >= testTimeFragment(bArr[1][0]);
        }

        return isBefore;

    });
});

function formatOutput(output) {
    var str = '\n> 收入汇总\n';
    str += '> ---\n';

    output.forEach(item => {
        var key = Object.keys(item)[0];
        str += '> 场地:' + key + '\n';

        item[key].forEach(i => {
            str += '> ' + i + '\n';
        });
        if (key == 'D') {
            str += '> 小计: ' + item['total' + key] + '元\n';
        } else {
            str += '> 小计: ' + item['total' + key] + '元\n>\n';
        }
    });

    str += '> ---\n';
    str += '> 总计: ' + calcuTotalMoney(output) + '元';
    return str;
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
    formatOutput
};
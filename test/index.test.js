var chai = require('chai');
var assert = chai.assert;
var method = require('../index.js');
var moment = require('moment');

describe('检测选择的日期是否是今天或未来的某一天', function() {

    it('选择未来的某一天（如2017-09-23） 返回true', function() {
        assert.equal(method.isValidDate('2017-09-23'), true);
    });

    it('选择今天,返回true', function() {
        var today = moment().format('YYYY-MM-DD');
        assert.equal(method.isValidDate(today), true);
    });

    it('过期的时间（如2017-06-12）应该返回false', function() {
        assert.equal(method.isValidDate('2017-06-12'), false);
    });

    it('输入的日期格式（如2017-09-43）不正确返回false', function() {
        assert.equal(method.isValidDate('2017-09-43'), false);
    });

});

describe('判断userId是否符合以U开头，以数字结尾的格式', function() {
    it('U123 符合格式', function() {
        assert.equal(method.isValidUserId('U123'), true)
    });

    it('U123we 不符合格式', function() {
        assert.equal(method.isValidUserId('U123we'), false)
    });

    it('u123 不符合格式', function() {
        assert.equal(method.isValidUserId('u123'), false)
    })
});

describe('判断输入的时间段是否合法,时间段为9:00~22:00整点', function() {
    it('9:00~10:00 是合法的，返回[9,10]', function() {
        assert.deepEqual(method.testTimeFragment('9:00~10:00'), [9, 10])
    });

    it('9:00~14:00 是合法的，返回[9,14]', function() {
        assert.deepEqual(method.testTimeFragment('9:00~14:00'), [9, 14])
    });

    it('10:00~10:00 是不合法的，返回false', function() {
        assert.equal(method.testTimeFragment('10:00~10:00'), false)
    });

    it('8:00~10:00 是不合法的，返回false', function() {
        assert.equal(method.testTimeFragment('8:00~10:00'), false)
    });

    it('9:40~10:00 是不合法的，返回false', function() {
        assert.equal(method.testTimeFragment('9:40~10:00'), false)
    });

    it('ewefwe 是不合法的，返回false', function() {
        assert.equal(method.testTimeFragment('ewefwe'), false)
    });
});

describe('判断场地是否正确（A|B|C|D）', function() {
    it('A 是正确的，返回 A', function() {
        assert.equal(method.testSite('A'), "A")
    });

    it('B 是正确的，返回 B', function() {
        assert.equal(method.testSite('B'), "B")
    });

    it('C 是正确的，返回 C', function() {
        assert.equal(method.testSite('C'), "C")
    });

    it('D 是正确的，返回 D', function() {
        assert.equal(method.testSite('D'), "D")
    });

    it('s 是错误的，返回 false', function() {
        assert.equal(method.testSite('s'), false)
    });

});

describe('判断用户输入是否正确', function() {
    it('{U002 2017-09-22 20:00~21:00 A} 应该为 success ', function() {
        assert.equal(method.checkInput('U002 2017-09-22 20:00~21:00 A'), 'Success: the booking is accepted!')
    });

    it('{U002 2017-09-22 20:00~22:00 A} 应该为 success ', function() {
        assert.equal(method.checkInput('U002 2017-09-22 20:00~22:00 A'), 'Success: the booking is accepted!')
    });

    it('{U002 2017-09-22 09:00~22:00 B} 应该为 success ', function() {
        assert.equal(method.checkInput('U002 2017-09-22 09:00~22:00 B'), 'Success: the booking is accepted!')
    });

    it('{U013 2017-09-22 20:00~22:00 A} 应该为 success ', function() {
        assert.equal(method.checkInput('U013 2017-09-22 20:00~22:00 A'), 'Success: the booking is accepted!')
    });

    it('{U013 2017-09-22 20:00~22:00 A C} 应该为 success ', function() {
        assert.equal(method.checkInput('U013 2017-09-22 20:00~22:00 A C'), 'Success: the booking is accepted!')
    });

    it('{U323 2017-09-22 08:00~22:00 D} 应该为 error ', function() {
        assert.equal(method.checkInput('U323 2017-09-22 08:00~22:00 A'), 'Error: the booking is invalid!')
    });

    it('{U323 2017-09-22 20:00~22:00 A C} 应该为 error ', function() {
        assert.equal(method.checkInput('U323 2017-09-22 20:00~22:00 A C'), 'Error: the booking is invalid!')
    });

    it('{U002 2017-09-02 20:00~22:00 A} 应该为 error ', function() {
        assert.equal(method.checkInput('U002 2017-09-02 20:00~22:00 A'), 'Error: the booking is invalid!')
    });

    it('{U002 2017-09-02 20:00~20:00 A} 应该为 error ', function() {
        assert.equal(method.checkInput('U002 2017-09-02 20:00~20:00 A'), 'Error: the booking is invalid!')
    });

    it('{U002 2017-09-02 20:00~22:00 sdfA} 应该为 error ', function() {
        assert.equal(method.checkInput('U002 2017-09-02 20:00~22:00 sdfA'), 'Error: the booking is invalid!')
    });

    it('{U0ds02 2017-09-d02 20:00~22:00 sdfA} 应该为 error ', function() {
        assert.equal(method.checkInput('U00ds2 2017-09-d02 20:00~22:00 sdfA'), 'Error: the booking is invalid!')
    });

});

describe('计算各时间段的价格', function() {

    it('周内 9:00~12:00 价格为 90 元', function() {
        assert.equal(method.calcuMoney(9, 12, false), 90);
    });

    it('周内 9:00~10:00 价格为 30 元', function() {
        assert.equal(method.calcuMoney(9, 10, false), 30);
    });

    it('周内 9:00~13:00 价格为 140 元', function() {
        assert.equal(method.calcuMoney(9, 13, false), 140);
    });

    it('周内 10:00~12:00 价格为 60 元', function() {
        assert.equal(method.calcuMoney(10, 12, false), 60);
    });

    it('周内 10:00~14:00 价格为 160 元', function() {
        assert.equal(method.calcuMoney(10, 14, false), 160);
    });

    it('周内 12:00~16:00 价格为 200 元', function() {
        assert.equal(method.calcuMoney(12, 16, false), 200);
    });

    it('周内 12:00~18:00 价格为 300 元', function() {
        assert.equal(method.calcuMoney(12, 18, false), 300);
    });

    it('周内 12:00~19:00 价格为 380 元', function() {
        assert.equal(method.calcuMoney(12, 19, false), 380);
    });

    it('周内 12:00~20:00 价格为 460 元', function() {
        assert.equal(method.calcuMoney(12, 20, false), 460);
    });

    it('周内 15:00~21:00 价格为 370 元', function() {
        assert.equal(method.calcuMoney(15, 21, false), 370);
    });

    it('周内 13:00~19:00 价格为 330 元', function() {
        assert.equal(method.calcuMoney(13, 19, false), 330);
    });

    it('周内 18:00~21:00 价格为 220 元', function() {
        assert.equal(method.calcuMoney(18, 21, false), 220);
    });

    it('周内 9:00~20:00 价格为 550 元', function() {
        assert.equal(method.calcuMoney(9, 20, false), 550);
    });

    it('周内 9:00~22:00 价格为 670 元', function() {
        assert.equal(method.calcuMoney(9, 22, false), 670);
    });

    it('周末 9:00~12:00 价格为 120 元', function() {
        assert.equal(method.calcuMoney(9, 12, true), 120);
    });

    it('周末 10:00~11:00 价格为 40 元', function() {
        assert.equal(method.calcuMoney(10, 11, true), 40);
    });

    it('周末 11:00~14:00 价格为 140 元', function() {
        assert.equal(method.calcuMoney(11, 14, true), 140);
    });

    it('周末 13:00~16:00 价格为 150 元', function() {
        assert.equal(method.calcuMoney(13, 16, true), 150);
    });

    it('周末 12:00~18:00 价格为 300 元', function() {
        assert.equal(method.calcuMoney(12, 18, true), 300);
    });

    it('周末 19:00~20:00 价格为 60 元', function() {
        assert.equal(method.calcuMoney(19, 20, true), 60);
    });

    it('周末 18:00~22:00 价格为 240 元', function() {
        assert.equal(method.calcuMoney(18, 22, true), 240);
    });

    it('周末 15:00~20:00 价格为 270 元', function() {
        assert.equal(method.calcuMoney(15, 20, true), 270);
    });

    it('周末 16:00~22:00 价格为 390 元', function() {
        assert.equal(method.calcuMoney(16, 22, true), 340);
    });

    it('周末 9:00~19:00 价格为 480 元', function() {
        assert.equal(method.calcuMoney(9, 19, true), 480);
    });

    it('周末 10:00~20:00 价格为 500 元', function() {
        assert.equal(method.calcuMoney(9, 12, true), 120);
    });

    it('周末 9:00~22:00 价格为 660 元', function() {
        assert.equal(method.calcuMoney(9, 22, true), 660);
    });

});

describe('计算总价格', function() {
    it('以上的输出总价为910元', function() {
        assert.equal(method.calcuTotalMoney(method.output), 910);
    });
});

describe('格式化输出', function() {
    it('格式应该如期望的一样', function() {
        assert.equal(method.formatOutput(method.output), `收入汇总
---
场地:A
2017-09-22 20:00~21:00 60元
2017-09-22 20:00~22:00 违约金 60元
2017-09-22 20:00~22:00 120元
小计:240元

场地:B
2017-09-22 09:00~22:00 670元
小计:670元

场地:C
小计:0元

场地:D
小计:0元
---
总计:910元`);
    })
})
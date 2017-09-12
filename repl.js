var repl = require('repl');

var method = require('./index.js');

const r = repl.start({
    prompt: '',
    eval: myEval
})

function myEval(cmd, context, filename, callback) {
    var promp = method.checkInput(cmd.trim());
    if (promp && cmd !== '\n') {

        console.log('> ' + promp);
    }
    if (cmd == '\n') {
        method.calcuTotalMoney(method.output);
        console.log(method.formatOutput(method.output));
    }
    callback(null);
}
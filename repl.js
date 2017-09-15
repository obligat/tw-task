let repl = require('repl');

let method = require('./index.js');

repl.start({
    prompt: '',
    eval: myEval
});

function myEval(cmd, context, filename, callback) {
    let promp = method.checkInput(cmd.trim());
    if (promp && cmd !== '\n') {

        console.log('> ' + promp);
    }
    if (cmd === '\n') {
        method.calcuTotalMoney(method.output);
        console.log(method.formatOutput(method.output));
        method.output = method.resetOutput();
    }
    callback(null);
}
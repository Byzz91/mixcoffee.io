const nodeConsole = require('console');
const console = new nodeConsole.Console(process.stdout, process.stderr);
const clipboard = require('./modules/clipboard');

console.log('Hello World');

clipboard.listen('changed', (data) => {
    console.log('-- text changed --');
    console.log('data', data);
});

clipboard.watcher();
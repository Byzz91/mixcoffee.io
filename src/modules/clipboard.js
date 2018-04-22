/**
 * Clipboard in mixcoffee.io
 */
((module, factory) => {
    if (typeof module === 'object' && 'exports' in module) {
        module.exports = factory();
    }
})(module, function () {
    const { clipboard } = require('electron');
    const isUrl = require('is-url');
    const log = require('electron-log');
    const WATCHER_INTERVAL = 50;

    let _timerWatcher = {};
    let _listenerObjects = {};
    
    /**
     * Watching Clipboard Data
     */
    function _watcher() {
        log.info('start clipboard watcher();');
        let beforeData = String();

        _timerWatcher = setInterval(() => {
            let data = clipboard.readText();

            // It was changed text !!
            if (beforeData !== data) {
                __listenerCall('changed', { before: beforeData, changed: data });
                beforeData = data;
            }
        }, WATCHER_INTERVAL);
    }

    /**
     * private __listenerCall
     * @param {String} enum{changed}
     * @param {Object} parameters 
     */
    function __listenerCall(type, parameters) {
        if (type in _listenerObjects && typeof _listenerObjects[type] === 'function') {
            (_listenerObjects[type])(parameters);
        }
    }

    /**
     * Clipboard Listener
     * @param {String} ENUM{changed}
     * @param {Function} callback 
     */
    function _listen(type, callback) {
        type = String(type || '').trim().toLowerCase();

        if (typeof callback === 'function') {
            _listenerObjects[type] = callback;
        }
    }

    /**
     * Intelligent Guess Data and return new type object
     * @param {Object} data 
     */
    function _guess(data) {
        return new Promise((resolve) => {
            if (typeof data !== 'object') {
                return data;
            }

            let __clone = JSON.parse(JSON.stringify(data));
            let __type = 'plain';
            let __additional = null;

            if (true === isUrl(data.changed)) {
                __type = 'url';
            }

            resolve({
                type: __type,
                before: __clone.before,
                changed: __clone.changed,
                addtional: __additional
            });
        });
    }

    /**
     * Public
     */
    return {
        watcher: _watcher,
        listen: _listen,
        on: _listen,
        guess: _guess
    }
});
var TestServerTask = require('ember-cli/lib/tasks/test-server');

module.exports = TestServerTask.extend({
    
    testemOptions(options) {
        let testemOptions = this._super(...arguments);
        testemOptions.additionalBrowserSocketEvents = options.additionalBrowserSocketEvents;
        testemOptions.browserModuleMapping = options.browserModuleMapping;
        return testemOptions;
    }
});
var TestTask = require('ember-cli/lib/tasks/test');

module.exports = TestTask.extend({

    testemOptions(options) {
        let testemOptions = this._super(...arguments);
        testemOptions.additionalBrowserSocketEvents = options.additionalBrowserSocketEvents;
        testemOptions.browserModuleMapping = options.browserModuleMapping;
        return testemOptions;
    }
});
var TestServerTask = require('ember-cli/lib/tasks/test-server');

module.exports = TestServerTask.extend({
  
  testemOptions(options) {
    const testemOptions = this._super(...arguments);
    testemOptions.additionalBrowserSocketEvents = options.additionalBrowserSocketEvents;
    return testemOptions;
  }
});
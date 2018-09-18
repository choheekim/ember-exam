var TestTask = require('ember-cli/lib/tasks/test');

module.exports = TestTask.extend({

  testemOptions(options) {
    const testemOptions = this._super(...arguments);
    testemOptions.additionalBrowserSocketEvents = options.additionalBrowserSocketEvents;
    return testemOptions;
  }
});
'use strict';

const exam = require('../commands/exam');

/**
 * Performs logic related to validating command options for testing and
 * determining which functions to run on the tests.
 *
 * @class TestsOptionsValidator
 */
function TestsOptionsValidator(options, framework) {
  this.options = options;
  this.framework = framework;
}

/**
 * Determines if we should split the tests file and validates associated options
 * (`split`, `partition`).
 *
 * @public
 * @type {Boolean}
 */
Object.defineProperty(TestsOptionsValidator.prototype, 'shouldSplit', {
  get: function _getShouldSplit() {
    var options = this.options;
    var split = options.split;

    if (typeof split !== 'undefined' && split < 2) {
      // eslint-disable-next-line no-console
      console.warn('You should specify a number of files greater than 1 to split your tests across. Defaulting to 1 split which is the same as not using `--split`.');
      split = 1;
    }

    var partitions = options.partition;

    if (typeof partitions !== 'undefined') {
      validatePartitions(partitions, split);
    }

    return !!split;
  }
});

/**
 * Validates the specified partitions
 *
 * @private
 * @param {Array} partitions
 * @param {Number} split
 */
function validatePartitions(partitions, split) {
  validatePartitionSplit(partitions, split);
  validateElementsUnique(partitions);
}

/**
 * Validates the specified reply-browser
 *
 * @param {*} replayBrowser
 * @param {*} replayExecution
 */
function validateReplyBrowser(replayBrowser, replayExecution, options) {

  exam.prototype.executionMappingObj = exam.prototype.getExecutionMappigInstance(options);
  const numberOfBrowsers = exam.prototype.executionMappingObj['numberOfBrowsers'];


  if(!replayExecution) {
    throw new Error('You must specifiy a \'reply-execution\' value in order to use \'reply-browser\' option.');
  }

  for (const i in replayBrowser) {
    const browserId = replayBrowser[i]
    if (browserId < 1) {
      throw new Error('You must specify reply-browser values greater than or equal to 1.');
    }
    if (browserId > numberOfBrowsers) {
      throw new Error('You must specify replayBrowser value smaller than a number of browsers in the specified json file.');
    }
  }

  validateElementsUnique(replayBrowser);
}

/**
 * Determines if the specified partitions value makes sense for a given split.
 *
 * @private
 * @param {Array} partitions
 * @param {Number} split
 */
function validatePartitionSplit(partitions, split) {
  if (!split) {
    throw new Error('You must specify a \'split\' value in order to use \'partition\'.');
  }

  for (var i = 0; i < partitions.length; i++) {
    var partition = partitions[i];
    if (partition < 1) {
      throw new Error('Split tests are one-indexed, so you must specify partition values greater than or equal to 1.');
    }

    if (partition > split) {
      throw new Error('You must specify \'partition\' values that are less than or equal to your \'split\' value.');
    }
  }
}

/**
 * Ensures that there is no partition listed twice
 *
 * @private
 * @param {Array} arr
 */
function validateElementsUnique(arr) {
  arr = arr.sort();
  for (var i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      throw new Error('You cannot specify the same value twice.');
    }
  }
}

/**
 * Determines if we should randomize the tests and validates associated options
 * (`random`).
 *
 * @public
 * @type {Boolean}
 */
Object.defineProperty(TestsOptionsValidator.prototype, 'shouldRandomize', {
  get: function _getShouldRandomize() {
    var shouldRandomize = (typeof this.options.random === 'string');

    if (shouldRandomize && this.framework === 'mocha') {
      // eslint-disable-next-line no-console
      console.warn('Mocha does not currently support randomizing test order, so tests will run in normal order. Please see https://github.com/mochajs/mocha/issues/902 for more info.');
    }

    return shouldRandomize;
  }
});

/**
 * Determines if we should run split tests in parallel and validates associated
 * options (`parallel`).
 *
 * @public
 * @type {Boolean}
 */
Object.defineProperty(TestsOptionsValidator.prototype, 'shouldParallelize', {
  get: function _getShouldParallelize() {
    var parallel = this.options.parallel;

    if (!parallel) {
      return false;
    }

    if (typeof this.options.loadBalance !== 'undefined') {
      throw new Error('You must not use the `load-balance` option with the `parallel` option.');
    }

    if (!this.shouldSplit) {
      throw new Error('You must specify the `split` option in order to run your tests in parallel.');
    }

    return true;
  }
});

Object.defineProperty(TestsOptionsValidator.prototype, 'shouldLoadBalance', {
  get: function _shouldLoadBalance() {
    var loadBalance = this.options.loadBalance;

    if(typeof loadBalance == 'undefined') {
      return false;
    }

    if (loadBalance < 1) {
      throw new Error('You must specify a load-balance value greater than or equal to 1.');
    }

    if (this.options.parallel) {
      throw new Error('You must not use the `parallel` option with the `load-balance` option.');
    }

    return true;
  }
});

/**
 * Determines if we should replay execution for reproduction.
 * options (`replay-execution`).
 *
 * @public
 * @type {Boolean}
 */
Object.defineProperty(TestsOptionsValidator.prototype, 'shouldReplayExecution', {
  get: function _getShouldReplyExecution() {
    const replayBrowser = this.options.replayBrowser;
    const replayExecution = this.options.replayExecution;

    if(!replayExecution) {
      return false;
    }

    if(!replayBrowser) {
      throw new Error('You must specifiy the `reply-browser` option in order to use `reply-execution` option.');
    }

    validateReplyBrowser(replayBrowser, replayExecution, this.options);

    return true;
  }
});

module.exports = TestsOptionsValidator;
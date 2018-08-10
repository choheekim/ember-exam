function getWeight(moduleName) {
    var weight = -1;
    if (moduleName.includes('/jshint/')) {
        weight = 1;
    } else if (moduleName.includes('/unit/')) {
        weight = 10;
    } else if (moduleName.includes('/integration/')) {
        weight = 20;
    } else if (moduleName.includes('/acceptance/')) {
        weight = 150;
    } else {
        weight = 50;
    }
    return weight;
}

function maxIndex(array) {
    return array.reduce(function(max, value, index, arr) {
        return value > arr[max] ? index : max;
    }, 0);
}

export default function weightTestModules(modules) {
    var weightedModule = [];
    var groups = [];
    var weights = [];

    modules.forEach(function(module) {
        var moduleWeight = getWeight(module);

        if (!weights.includes(moduleWeight)) {
            weights.push(moduleWeight);
        }

        var index = weights.indexOf(moduleWeight);
        if (typeof groups[index] == 'undefined') {
            groups[index] = [];
        }
        groups[index].push(module);
    });

    var i = 0;
    var length = weights.length;

    while(i < length) {
        var max = maxIndex(weights);
        if (max < 0) {
            i++;
            continue;
        }
        var sortedMoudleArr = groups[max].sort();
        weightedModule = weightedModule.concat(sortedMoudleArr);
        weights[max] = -1;

        i++;
    }

    return weightedModule;
}
'use strict';

class RemoveLogGroups {
    constructor(serverless, options) { // jshint ignore:line
        this.hooks = {
            'before:package:finalize': function () {
                removeCloudwatchLogGroups(serverless);
            }
        };
    }
}

function removeCloudwatchLogGroups(serverless) {
    let rsrc = serverless.service.provider.compiledCloudFormationTemplate.Resources;
    for (let key in rsrc) {
        if (rsrc[key].Type === 'AWS::Logs::LogGroup') {
            delete rsrc[key];
        } else if (rsrc[key].Type === 'AWS::Lambda::Function') {
            let dependencies = [];
            for (let dependency of rsrc[key].DependsOn) {
                if (!dependency.endsWith('LogGroup')) {
                    dependencies.push(dependency);
                }
            }
            rsrc[key].DependsOn = dependencies;
        }
    }
}

module.exports = RemoveLogGroups;

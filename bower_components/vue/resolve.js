/**
 * require 引入Q解决加载标准的问题
 * author wanggang
 * date 2020-02-26 14:26
 */
define(["require", "promise"], function(require, Q){
    var resolve = function(dep) {
        return function() {
            if (!(dep instanceof Array)) {
                dep = [dep];
            }
            var deferred = Q.defer();
            require(dep, function(res) {
                deferred.resolve(res);
            });
            return deferred.promise;
        };
    };
    return resolve;
});
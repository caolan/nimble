(function (exports) {

var _ = (typeof window === 'undefined') ? require('../nimble'): window._;


var toArray = function (a) {
    return Array.prototype.slice.call(a);
};


exports['each - sync'] = function (test) {
    var calls = [];
    _.each([1,2,3], function (value, index, arr) {
        calls.push(toArray(arguments));
    });
    test.same(calls, [
        [1, 0, [1,2,3]],
        [2, 1, [1,2,3]],
        [3, 2, [1,2,3]]
    ]);
    test.done();
};

exports['each - sync, object'] = function (test) {
    var calls = [];
    var obj = {
        a: 1,
        b: 2,
        c: 3
    };
    _.each(obj, function (value, index, arr) {
        calls.push(toArray(arguments));
    });
    test.same(calls, [
        [1, 'a', obj],
        [2, 'b', obj],
        [3, 'c', obj]
    ]);
    test.done();
};

exports['each - async'] = function (test) {
    var calls = [];
    _.each([1,2,3], function (value, index, arr, cb) {
        calls.push(toArray(arguments).slice(0, 3));
        setTimeout(cb, 0);
    }, function () {
        test.same(calls, [
            [1, 0, [1,2,3]],
            [2, 1, [1,2,3]],
            [3, 2, [1,2,3]]
        ]);
        test.done();
    });
};

exports['each - async, object'] = function (test) {
    var calls = [];
    var obj = {
        a: 1,
        b: 2,
        c: 3
    };
    _.each(obj, function (value, index, arr, cb) {
        calls.push(toArray(arguments).slice(0, 3));
        setTimeout(cb, 0);
    }, function () {
        test.same(calls, [
            [1, 'a', obj],
            [2, 'b', obj],
            [3, 'c', obj]
        ]);
        test.done();
    });
};

exports['each - async, reduced arity'] = function (test) {
    var calls = [];
    _.each([1,2,3], function (value, cb) {
        calls.push(value);
        setTimeout(cb, 0);
    }, function () {
        test.same(calls, [1,2,3]);
        test.done();
    });
};

exports['each - async, empty array'] = function(test){
    _.each([], function(x, callback){
        test.ok(false, 'iterator should not be called');
        callback();
    }, function(err){
        test.ok(true, 'should call callback');
        test.done();
    });
};

exports['each - async, error'] = function(test){
    _.each([1,2,3], function(x, callback){
        callback('error');
    }, function(err){
        test.equals(err, 'error');
        test.done();
    });
};

exports['map - sync'] = function (test) {
    var calls = [];
    test.same(
        _.map([1,2,3], function (value, index, arr) {
            calls.push(toArray(arguments));
            return value * 2;
        }),
        [2,4,6]
    );
    test.same(calls, [
        [1, 0, [1,2,3]],
        [2, 1, [1,2,3]],
        [3, 2, [1,2,3]]
    ]);
    test.done();
};

exports['map - sync, object'] = function (test) {
    var calls = [];
    var obj = {
        a: 1,
        b: 2,
        c: 3
    };
    test.same(
        _.map(obj, function (value, key, arr) {
            calls.push(toArray(arguments));
            return key + '=' + value;
        }),
        ['a=1', 'b=2', 'c=3']
    );
    test.same(calls, [
        [1, 'a', obj],
        [2, 'b', obj],
        [3, 'c', obj]
    ]);
    test.done();
};

exports['map - sync, original untouched'] = function(test){
    var a = [1,2,3];
    var results = _.map(a, function(x, callback){
        return x*2;
    });
    test.same(results, [2,4,6]);
    test.same(a, [1,2,3]);
    test.done();
};

exports['map - sync, object, original untouched'] = function(test){
    var a = {a:1,b:2,c:3};
    var results = _.map(a, function(x, callback){
        return x*2;
    });
    test.same(results, [2,4,6]);
    test.same(a, {a:1,b:2,c:3});
    test.done();
};

exports['map - async'] = function (test) {
    var calls = [];
    _.map([1,2,3], function (value, index, arr, cb) {
        calls.push(toArray(arguments).slice(0, 3));
        setTimeout(function () {
            cb(null, value * 2);
        }, 0);
    }, function (err, result) {
        test.equal(err, null);
        test.same(result, [2,4,6]);
        test.same(calls, [
            [1, 0, [1,2,3]],
            [2, 1, [1,2,3]],
            [3, 2, [1,2,3]]
        ]);
        test.done();
    });
};

exports['map - async, object'] = function (test) {
    var calls = [];
    var obj = {
        a: 1,
        b: 2,
        c: 3
    };
    _.map(obj, function (value, index, arr, cb) {
        calls.push(toArray(arguments).slice(0, 3));
        setTimeout(function () {
            cb(null, value * 2);
        }, 0);
    }, function (err, result) {
        test.equal(err, null);
        test.same(result, [2, 4, 6]);
        test.same(calls, [
            [1, 'a', obj],
            [2, 'b', obj],
            [3, 'c', obj]
        ]);
        test.done();
    });
};

exports['map - async, reduced arity'] = function (test) {
    var calls = [];
    _.map([1,2,3], function (value, cb) {
        calls.push(value);
        setTimeout(function () {
            cb(null, value * 2);
        }, 0);
    }, function (err, result) {
        test.equal(err, null);
        test.same(result, [2,4,6]);
        test.same(calls, [1,2,3]);
        test.done();
    });
};

exports['map - async, original untouched'] = function(test){
    var a = [1,2,3];
    _.map(a, function(x, callback){
        callback(null, x*2);
    }, function(err, results){
        test.same(results, [2,4,6]);
        test.same(a, [1,2,3]);
        test.done();
    });
};

exports['map - async, object, original untouched'] = function(test){
    var a = {a:1,b:2,c:3};
    _.map(a, function(x, callback){
        callback(null, x*2);
    }, function(err, results){
        test.same(results, [2,4,6]);
        test.same(a, {a:1,b:2,c:3});
        test.done();
    });
};

exports['map - async, error'] = function(test){
    _.map([1,2,3], function(x, callback){
        callback('error');
    }, function(err, results){
        test.equals(err, 'error');
        test.done();
    });
};

exports['filter - sync'] = function (test) {
    var calls = [];
    test.same(
        _.filter([1,2,3], function (value) {
            calls.push(toArray(arguments));
            return value % 2;
        }),
        [1,3]
    );
    test.same(calls, [
        [1, 0, [1,2,3]],
        [2, 1, [1,2,3]],
        [3, 2, [1,2,3]]
    ]);
    test.done();
};

exports['filter - sync, object'] = function (test) {
    var calls = [];
    var obj = {
        a: 1,
        b: 2,
        c: 3
    };
    test.same(
        _.filter(obj, function (value, key, arr) {
            calls.push(toArray(arguments));
            return value % 2;
        }),
        [1,3]
    );
    test.same(calls, [
        [1, 'a', obj],
        [2, 'b', obj],
        [3, 'c', obj]
    ]);
    test.done();
};

exports['filter - sync, original untouched'] = function(test){
    var a = [3,1,2];
    var results = _.filter(a, function(x){
        return x % 2;
    });
    test.same(results, [3,1]);
    test.same(a, [3,1,2]);
    test.done();
};

exports['filter - async'] = function (test) {
    var calls = [];
    _.filter([1,2,3], function (value, index, arr, cb) {
        calls.push(toArray(arguments).slice(0, 3));
        setTimeout(function () {
            cb(null, value % 2);
        }, 0);
    }, function (err, result) {
        test.equal(err, null);
        test.same(result, [1,3]);
        test.same(calls, [
            [1, 0, [1,2,3]],
            [2, 1, [1,2,3]],
            [3, 2, [1,2,3]]
        ]);
        test.done();
    });
};

exports['filter - async, object'] = function (test) {
    var calls = [];
    var obj = {
        a: 1,
        b: 2,
        c: 3
    };
    _.filter(obj, function (value, index, arr, cb) {
        calls.push(toArray(arguments).slice(0, 3));
        setTimeout(function () {
            cb(null, value % 2);
        }, 0);
    }, function (err, result) {
        test.equal(err, null);
        test.same(result, [1, 3]);
        test.same(calls, [
            [1, 'a', obj],
            [2, 'b', obj],
            [3, 'c', obj]
        ]);
        test.done();
    });
};

exports['filter - async, reduced arity'] = function (test) {
    var calls = [];
    _.filter([1,2,3], function (value, cb) {
        calls.push(value);
        setTimeout(function () {
            cb(null, value % 2);
        }, 0);
    }, function (err, result) {
        test.equal(err, null);
        test.same(result, [1,3]);
        test.same(calls, [1,2,3]);
        test.done();
    });
};

exports['filter - async, original untouched'] = function(test){
    var a = [3,1,2];
    _.filter(a, function(x, callback){
        callback(null, x % 2);
    }, function(err, results){
        test.same(results, [3,1]);
        test.same(a, [3,1,2]);
        test.done();
    });
};

exports['filter - async, error'] = function(test){
    _.filter([1,2,3], function(x, callback){
        callback('error');
    }, function(err, results){
        test.equals(err, 'error');
        test.done();
    });
};

exports['reduce - sync'] = function (test) {
    var calls = [];
    test.equal(
        _.reduce([1,2,3], function (a, value, index, arr) {
            calls.push(toArray(arguments));
            return a + value;
        }, 10),
        16
    );
    test.same(calls, [
        [10, 1, 0, [1,2,3]],
        [11, 2, 1, [1,2,3]],
        [13, 3, 2, [1,2,3]]
    ]);
    test.done();
};

exports['reduce - sync, object'] = function (test) {
    var calls = [];
    var obj = {
        a: 1,
        b: 2,
        c: 3
    };
    test.equal(
        _.reduce(obj, function (a, value, index, arr) {
            calls.push(toArray(arguments));
            return a + value;
        }, 10),
        16
    );
    test.same(calls, [
        [10, 1, 'a', obj],
        [11, 2, 'b', obj],
        [13, 3, 'c', obj]
    ]);
    test.done();
};

exports['reduce - async'] = function (test) {
    var calls = [];
    _.reduce([1,2,3], function (a, value, index, arr, cb) {
        calls.push(toArray(arguments).slice(0,4));
        setTimeout(function () {
            cb(null, a + value);
        }, 0);
    }, 10, function (err, result) {
        test.equal(err, null);
        test.equal(result, 16);
        test.same(calls, [
            [10, 1, 0, [1,2,3]],
            [11, 2, 1, [1,2,3]],
            [13, 3, 2, [1,2,3]]
        ]);
        test.done();
    });
};

exports['reduce - async, object'] = function (test) {
    var calls = [];
    var obj = {
        a: 1,
        b: 2,
        c: 3
    };
    _.reduce(obj, function (a, value, index, arr, cb) {
        calls.push(toArray(arguments).slice(0,4));
        setTimeout(function () {
            cb(null, a + value);
        }, 0);
    }, 10, function (err, result) {
        test.equal(err, null);
        test.equal(result, 16);
        test.same(calls, [
            [10, 1, 'a', obj],
            [11, 2, 'b', obj],
            [13, 3, 'c', obj]
        ]);
        test.done();
    });
};

exports['reduce - async, reduce arity'] = function (test) {
    _.reduce([1,2,3], function (a, value, cb) {
        setTimeout(function () {
            cb(null, a + value);
        }, 0);
    }, 10, function (err, result) {
        test.equal(err, null);
        test.equal(result, 16);
        test.done();
    });
};

exports['reduce - async with non-reference memo'] = function(test){
    _.reduce([1,3,2], function(a, x, callback){
        setTimeout(function(){callback(null, a + x)}, Math.random()*100);
    }, 0, function(err, result){
        test.equals(result, 6);
        test.done();
    });
};

exports['reduce - async, error'] = function(test){
    _.reduce([1,2,3], function(a, x, callback){
        callback('error');
    }, 0, function(err, result){
        test.equals(err, 'error');
        test.done();
    });
};

exports['parallel'] = function(test){
    var call_order = [];
    _.parallel([
        function(callback){
            setTimeout(function(){
                call_order.push(1);
                callback(null, 1);
            }, 50);
        },
        function(callback){
            setTimeout(function(){
                call_order.push(2);
                callback(null, 2);
            }, 100);
        },
        function(callback){
            setTimeout(function(){
                call_order.push(3);
                callback(null, 3,3);
            }, 25);
        }
    ],
    function(err, results){
        test.equals(err, null);
        test.same(call_order, [3,1,2]);
        test.same(results, [1,2,[3,3]]);
        test.done();
    });
};

exports['parallel empty array'] = function(test){
    _.parallel([], function(err, results){
        test.equals(err, null);
        test.same(results, []);
        test.done();
    });
};

exports['parallel error'] = function(test){
    _.parallel([
        function(callback){
            callback('error', 1);
        },
        function(callback){
            callback('error2', 2);
        }
    ],
    function(err, results){
        test.equals(err, 'error');
        test.done();
    });
};

exports['parallel no callback'] = function(test){
    _.parallel([
        function(callback){callback();},
        function(callback){callback(); test.done();},
    ]);
};

exports['parallel object'] = function(test){
    var call_order = [];
    _.parallel({
        one: function(callback){
            setTimeout(function(){
                call_order.push(1);
                callback(null, 1);
            }, 50);
        },
        two: function(callback){
            setTimeout(function(){
                call_order.push(2);
                callback(null, 2);
            }, 100);
        },
        three: function(callback){
            setTimeout(function(){
                call_order.push(3);
                callback(null, 3,3);
            }, 25);
        }
    },
    function(err, results){
        test.equals(err, null);
        test.same(call_order, [3,1,2]);
        test.same(results, {
            one: 1,
            two: 2,
            three: [3,3]
        });
        test.done();
    });
};

exports['series'] = function(test){
    var call_order = [];
    _.series([
        function(callback){
            setTimeout(function(){
                call_order.push(1);
                callback(null, 1);
            }, 25);
        },
        function(callback){
            setTimeout(function(){
                call_order.push(2);
                callback(null, 2);
            }, 50);
        },
        function(callback){
            setTimeout(function(){
                call_order.push(3);
                callback(null, 3,3);
            }, 15);
        }
    ],
    function(err, results){
        test.equals(err, null);
        test.same(results, [1,2,[3,3]]);
        test.same(call_order, [1,2,3]);
        test.done();
    });
};

exports['series empty array'] = function(test){
    _.series([], function(err, results){
        test.equals(err, null);
        test.same(results, []);
        test.done();
    });
};

exports['series error'] = function(test){
    test.expect(1);
    _.series([
        function(callback){
            callback('error', 1);
        },
        function(callback){
            test.ok(false, 'should not be called');
            callback('error2', 2);
        }
    ],
    function(err, results){
        test.equals(err, 'error');
        test.done();
    });
};

exports['series no callback'] = function(test){
    _.series([
        function(callback){callback();},
        function(callback){callback(); test.done();},
    ]);
};

exports['series object'] = function(test){
    var call_order = [];
    _.series({
        one: function(callback){
            setTimeout(function(){
                call_order.push(1);
                callback(null, 1);
            }, 25);
        },
        two: function(callback){
            setTimeout(function(){
                call_order.push(2);
                callback(null, 2);
            }, 50);
        },
        three: function(callback){
            setTimeout(function(){
                call_order.push(3);
                callback(null, 3,3);
            }, 15);
        }
    },
    function(err, results){
        test.equals(err, null);
        test.same(results, {
            one: 1,
            two: 2,
            three: [3,3]
        });
        test.same(call_order, [1,2,3]);
        test.done();
    });
};

}(typeof exports === 'undefined' ? this.test_nimble = {}: exports));

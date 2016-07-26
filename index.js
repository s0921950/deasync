var bindings = require('bindings')('deasync');

function deasync(fn) {
  return function() {
    var done = false;
    var args = Array.prototype.slice.apply(arguments).concat(cb);
    var err;
    var res;

    fn.apply(this, args);
    module.exports.loopWhile(function(){ return !done;});
    if (err) {
      throw err;
    }
    return res;

    function cb(e, r) {
      err = e;
      res = r;
      done = true;
    }
  }
}

module.exports = deasync;

module.exports.sleep = deasync(function(timeout, done) {
  setTimeout(done, timeout);
});

module.exports.runLoopOnce = function() {
  process._tickDomainCallback();
  bindings.run();
}

module.exports.loopWhile = function(pred){
  while(pred()){
	process._tickDomainCallback();
	if(pred()) bindings.run();
  }
}

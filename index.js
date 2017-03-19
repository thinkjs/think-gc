const assert = require('assert');
const helper = require('think-helper');

//min interval, 1 hour
const MIN_INTERVAL = 3600 * 1000;
let intervalTimes = 0;
let gcTypes = {};
let timerStart = false;

function gc(instance, interval = MIN_INTERVAL){
  assert(instance && helper.isFunction(instance.gc), 'instance.gc must be a function');
  assert(instance && helper.isString(instance.gcType), 'instance.gcType must be a string');
  if(gcTypes[instance.gcType]) return;

  gcTypes[instance.gcType] = function(){
    if(helper.isFunction(interval)){
      if(!interval()) return;
    }else{
      let num = Math.floor(interval / MIN_INTERVAL);
      if(intervalTimes % num !== 0) return;
    }
    instance.gc();
  }

  if(!timerStart){
    timerStart = true;
    let timer = setInterval(() => {
      intervalTimes++;
      for(let type in gcTypes){
        gcTypes[type]();
      }
    }, MIN_INTERVAL);
    timer.unref();
  }
}

module.exports = gc;
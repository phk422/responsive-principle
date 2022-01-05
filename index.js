// 原始对象
const obj = {
  name: "phk",
  age: 18,
};

// 管理依赖的类
class Depend {
  constructor() {
    //存放要执行的函数
    this.depends = [];
  }

  /**
   * 添加依赖的方法
   * @param {*} dep
   */
  add(dep) {
    this.depends.push(dep);
  }

  /**
   * 执行所有依赖
   */
  notify() {
    this.depends.forEach((fn) => fn());
  }
}

// 封装依赖函数
let activeReactFn = null
function watchFn(fn) {
  activeReactFn = fn;
  fn();
  activeReactFn = null;
}

/**
 * 获取依赖对象
 * @param {*} target
 * @param {*} key
 */
const targetMap = new WeakMap();
function getDepend(target, key) {
  let map = targetMap.get(target);
  if (!map) {
    map = new Map();
    targetMap.set(target, map);
  }
  let depend = map.get(key);
  if (!depend) {
    depend = new Depend();
    map.set(key, depend);
  }
  return depend;
}

// 代理对象
const objProxy = new Proxy(obj, {
  get(target, key, receiver) {
    // 获取依赖对象
    const depend = getDepend(target, key);
    depend.add(activeReactFn);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    Reflect.set(target, key, value, receiver);
    const depend = getDepend(target, key);
    depend.notify();
  },
});

// watchFn(function () {
//   console.log("执行了name" + objProxy.name);
// });

// watchFn(function () {
//   console.log("执行了age" + objProxy.age);
// });

watchFn(function () {
  console.log("------------------------------------")
  console.log("执行了age" + objProxy.age);
  console.log("执行了name" + objProxy.name);
  console.log("------------------------------------")
});

objProxy.name = "drr";
// objProxy.age = 20;

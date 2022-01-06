let activeReactFn = null;
// 管理依赖的类
class Depend {
  constructor() {
    //存放要执行的函数
    this.depends = new Set();
  }

  /**
   * 添加依赖的方法
   * @param {*} dep
   */
  add(dep) {
    if (typeof dep === "function") {
      this.depends.add(dep);
    }
  }

  /**
   * 收集依赖
   */
  depend() {
    this.add(activeReactFn);
  }

  /**
   * 执行所有依赖
   */
  notify() {
    this.depends.forEach((fn) => fn());
  }
}

// 封装依赖函数
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

// 对象响应式方法（Vue3基于proxy实现）
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 获取依赖对象
      const depend = getDepend(target, key);
      depend.depend();
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      Reflect.set(target, key, value, receiver);
      const depend = getDepend(target, key);
      depend.notify();
    },
  });
}

// Vue2的实现(ES6之前)
function _reactive(obj) {
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get() {
        // 获取依赖对象
        const depend = getDepend(obj, key);
        depend.depend();
        return value;
      },
      set(newValue) {
        value = newValue;
        const depend = getDepend(obj, key);
        depend.notify();
      },
    });
  });
  return obj;
}

const objProxy = _reactive({
  name: "phk",
  age: 18,
});

// watchFn(function () {
//   console.log("执行了name" + objProxy.name);
// });

// watchFn(function () {
//   console.log("执行了age" + objProxy.age);
// });

watchFn(function () {
  console.log("------------------------------------");
  console.log("执行了age" + objProxy.age);
  console.log("执行了name" + objProxy.name);
  console.log("执行了name" + objProxy.name);
  console.log("执行了name" + objProxy.name);
  console.log("------------------------------------");
});

objProxy.name = "drr";
objProxy.age = 20;

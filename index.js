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
const depend = new Depend();
function watchFn(fn) {
  depend.add(fn);
}

// 代理对象
const objProxy = new Proxy(obj, {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    Reflect.set(target, key, value, receiver);
    depend.notify();
  },
});

watchFn(function () {
  console.log(objProxy.name);
  console.log("执行了");
});

objProxy.name = "drr";
objProxy.age = 20;

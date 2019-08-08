# async

async 函数是什么？一句话，它就是 Generator 函数的语法糖。

`async`函数对 Generator 函数的改进：

（1）内置执行器。

（2）更好的语义。

`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果。

（3）更广的适用性。

`co`模块约定，`yield`命令后面只能是 Thunk 函数或 Promise 对象，而`async`函数的`await`命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。

（4）返回值是 Promise。

`async`函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。



## 基本用法 

## 语法

### 返回 Promise 对象

`async`函数返回一个 Promise 对象。

`async`函数内部`return`语句返回的值，会成为`then`方法回调函数的参数。

`async`函数内部抛出错误，会导致返回的 Promise 对象变为`reject`状态。抛出的错误对象会被`catch`方法回调函数接收到。

### Promise 对象的状态变化

`async`函数返回的 Promise 对象，必须等到内部所有`await`命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到`return`语句或者抛出错误。

### await 命令

* 正常情况下，`await`命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。

* 另一种情况是，`await`命令后面是一个`thenable`对象（即定义`then`方法的对象），那么`await`会将其等同于 Promise 对象。

* `await`命令后面的 Promise 对象如果变为`reject`状态，则`reject`的参数会被`catch`方法的回调函数接收到。

  ```javascript
  async function f() {
    await Promise.reject('出错了');
  }
  
  f()
  .then(v => console.log(v))
  .catch(e => console.log(e))
  // 出错了
  ```

* 任何一个`await`语句后面的 Promise 对象变为`reject`状态，那么整个`async`函数都会中断执行。

* 我们希望即使前一个异步操作失败，也不要中断后面的异步操作。

  * 方法一：这时可以将第一个`await`放在`try...catch`结构里面，这样不管这个异步操作是否成功，第二个`await`都会执行。

    ```javascript
    async function f() {
      try {
        await Promise.reject('出错了');
      } catch(e) {
      }
      return await Promise.resolve('hello world');
    }
    
    f()
    .then(v => console.log(v))
    // hello world
    ```

  * `await`后面的 Promise 对象再跟一个`catch`方法，处理前面可能出现的错误。

    ```javascript
    async function f() {
      await Promise.reject('出错了')
        .catch(e => console.log(e));
      return await Promise.resolve('hello world');
    }
    
    f()
    .then(v => console.log(v))
    // 出错了
    // hello world
    ```

### 错误处理

* 如果`await`后面的异步操作出错，那么等同于`async`函数返回的 Promise 对象被`reject`。

* 防止出错的方法，也是将其放在`try...catch`代码块之中。

* 如果有多个`await`命令，可以统一放在`try...catch`结构中。

* 下面的例子使用`try...catch`结构，实现多次重复尝试。

  ```javascript
  const superagent = require('superagent');
  const NUM_RETRIES = 3;
  
  async function test() {
    let i;
    for (i = 0; i < NUM_RETRIES; ++i) {
      try {
        await superagent.get('http://google.com/this-throws-an-error');
        break;
      } catch(err) {}
    }
    console.log(i); // 3
  }
  
  test();
  ```

### 使用注意点

* (1) `await`命令后面的`Promise`对象，运行结果可能是`rejected`，所以最好把`await`命令放在`try...catch`代码块中。

* (2) 多个`await`命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。

  * 同时触发写法

    ```javascript
    // 写法一
    let [foo, bar] = await Promise.all([getFoo(), getBar()]);
    
    // 写法二
    let fooPromise = getFoo();
    let barPromise = getBar();
    let foo = await fooPromise;
    let bar = await barPromise;
    ```

* (3) `await`命令只能用在`async`函数之中，如果用在普通函数，就会报错。
* (4) async 函数可以保留运行堆栈。

## async 函数的实现原理

略

## 与其他异步处理方法的比较

略

## 实例：按顺序完成异步操作

并发发出远程请求。

```javascript
async function logInOrder(urls) {
  // 并发读取远程URL
  const textPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  });

  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}
```

上面代码中，虽然`map`方法的参数是`async`函数，但它是并发执行的，因为只有`async`函数内部是继发执行，外部不受影响。后面的`for..of`循环内部使用了`await`，因此实现了按顺序输出。

## 顶层 await

模块异步加载的问题：

```javascript
// awaiting.js
let output;
(async function main() {
  const dynamic = await import(someMission);
  const data = await fetch(url);
  output = someProcess(dynamic.default, data);
})();
export { output };
```

下面是加载这个模块的写法。

```javascript
// usage.js
import { output } from "./awaiting.js";

function outputPlusValue(value) { return output + value }

console.log(outputPlusValue(100));
setTimeout(() => console.log(outputPlusValue(100), 1000);
```

上面代码中，`outputPlusValue()`的执行结果，完全取决于执行的时间。如果`awaiting.js`里面的异步操作没执行完，加载进来的`output`的值就是`undefined`。



允许在模块的顶层独立使用`await`命令。这个提案的目的，是借用`await`解决模块异步加载的问题。

顶层的`await`命令，就是为了解决这个问题。它保证只有异步操作完成，模块才会输出值。

```javascript
// awaiting.js
const dynamic = import(someMission);
const data = fetch(url);
export const output = someProcess((await dynamic).default, await data);
```

上面代码中，两个异步操作在输出的时候，都加上了`await`命令。只有等到异步操作完成，这个模块才会输出值。

加载这个模块的写法如下。

```javascript
// usage.js
import { output } from "./awaiting.js";
function outputPlusValue(value) { return output + value }

console.log(outputPlusValue(100));
setTimeout(() => console.log(outputPlusValue(100), 1000);
```



> 注意，如果加载多个包含顶层`await`命令的模块，加载命令是同步执行的。
>
> ```javascript
> // x.js
> console.log("X1");
> await new Promise(r => setTimeout(r, 1000));
> console.log("X2");
> 
> // y.js
> console.log("Y");
> 
> // z.js
> import "./x.js";
> import "./y.js";
> console.log("Z");
> ```
>
> 上面代码有三个模块，最后的`z.js`加载`x.js`和`y.js`，打印结果是`X1`、`Y`、`X2`、`Z`。这说明，`z.js`并没有等待`x.js`加载完成，再去加载`y.js`。
## 并发（concurrency）和并行（parallelism）区别

并发是宏观概念，我分别有任务 A 和任务 B，在一段时间内通过任务间的切换完成了这两个任务，这种情况就可以称之为并发。

并行是微观概念，假设 CPU 中存在两个核心，那么我就可以同时完成任务 A、B。同时完成多个任务的情况就可以称之为并行。

## 回调函数（Callback）

回调地狱

* 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身

* 嵌套函数一多，就很难处理错误

* 不能使用 `try catch` 捕获错误

  > 同步代码执行完，try catch也执行完，异步请求抛出错误无法被捕获。

* 不能直接 `return`

  > 同步代码执行完，回调再return，也不能成功

## Generator

## Promise

涉及面试题：Promise 的特点是什么，分别有什么优缺点？什么是 Promise 链？Promise 构造函数执行和 then 函数执行有什么区别？

## async 及 await

async 及 await 的特点，它们的优点和缺点分别是什么？

await 原理是什么？

`async` 和 `await` 可以说是异步终极解决方案了，相比直接使用 `Promise` 来说，优势在于处理 `then`的调用链，能够更清晰准确的写出代码，毕竟写一大堆 `then` 也很恶心，并且也能**优雅地解决回调地狱问题**。当然也存在一些缺点，因为 `await` 将异步代码改造成了同步代码，如果**多个异步代码没有依赖性**却使用了 `await` 会导致**性能上的降低**。

**就是将 Generator 函数、Promise和自动执行器，包装在一个函数里。**



## 常用定时器函数

setTimeout、setInterval、requestAnimationFrame 各有什么特点？

setTimeout、setInterval 

如果你有循环定时器的需求，其实完全可以通过 `requestAnimationFrame` 来实现

```
function setInterval(callback, interval) {
  let timer
  const now = Date.now
  let startTime = now()
  let endTime = startTime
  const loop = () => {
    timer = window.requestAnimationFrame(loop)
    endTime = now()
    if (endTime - startTime >= interval) {
      startTime = endTime = now()
      callback(timer)
    }
  }
  timer = window.requestAnimationFrame(loop)
  return timer
}

let a = 0
setInterval(timer => {
  console.log(1)
  a++
  if (a === 3) cancelAnimationFrame(timer)
}, 1000)
```

首先 `requestAnimationFrame` 自带函数节流功能，基本可以保证在 16.6 毫秒内只执行一次（不掉帧的情况下），并且该函数的延时效果是精确的，没有其他定时器时间不准的问题。
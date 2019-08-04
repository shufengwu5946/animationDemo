# Iterator 和 for...of 循环

## Iterator概念

Iterator 的作用有三个：

* 一是为各种数据结构，提供一个统一的、简便的访问接口；
* 二是使得数据结构的成员能够按某种次序排列；
* 三是 ES6 创造了一种新的遍历命令`for...of`循环，Iterator 接口主要供`for...of`消费。



Iterator 的遍历过程：

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的`next`方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的`next`方法，直到它指向数据结构的结束位置。



每一次调用`next`方法，都会返回数据结构的当前成员的信息。

具体来说，就是返回一个包含`value`和`done`两个属性的对象：

* `value`属性是当前成员的值
* `done`属性是一个布尔值，表示遍历是否结束。



## 默认 Iterator 接口

Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即`for...of`循环。

一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。

ES6 规定，默认的 Iterator 接口部署在数据结构的`Symbol.iterator`属性，或者说，一个数据结构只要具有`Symbol.iterator`属性，就可以认为是“可遍历的”（iterable）。

* `Symbol.iterator`属性本身是一个函数，返回一个遍历器。
* 遍历器对象的根本特征就是具有`next`方法。
* `next`方法返回一个代表当前成员的信息对象，具有`value`和`done`两个属性。



> 原生具备 Iterator 接口的数据结构如下。
>
> - Array
> - Map
> - Set
> - String
> - TypedArray
> - 函数的 arguments 对象
> - NodeList 对象



> 一些例子
>
> ```javascript
> // 例子1
> class RangeIterator {
>   constructor(start, stop) {
>     this.value = start;
>     this.stop = stop;
>   }
> 
>   [Symbol.iterator]() { return this; }
> 
>   next() {
>     var value = this.value;
>     if (value < this.stop) {
>       this.value++;
>       return {done: false, value: value};
>     }
>     return {done: true, value: undefined};
>   }
> }
> 
> function range(start, stop) {
>   return new RangeIterator(start, stop);
> }
> 
> for (var value of range(0, 3)) {
>   console.log(value); // 0, 1, 2
> }
> 
> 
> // 例子2:为对象添加Iterator接口
> let obj = {
>   data: [ 'hello', 'world' ],
>   [Symbol.iterator]() {
>     const self = this;
>     let index = 0;
>     return {
>       next() {
>         if (index < self.data.length) {
>           return {
>             value: self.data[index++],
>             done: false
>           };
>         } else {
>           return { value: undefined, done: true };
>         }
>       }
>     };
>   }
> };
> 
> for (const value of obj) {
>   console.log(value);
> }
> 
> 
> ```



> 对于类似数组的对象（存在数值键名和`length`属性），部署 Iterator 接口，有一个简便方法，就是`Symbol.iterator`方法直接引用数组的 Iterator 接口。有了遍历器接口，也可以使用`while`循环遍历。
>
> ```javascript
> let iterable = {
>   0: 'a',
>   1: 'b',
>   2: 'c',
>   length: 3,
>   [Symbol.iterator]: Array.prototype[Symbol.iterator]
> };
> for (let item of iterable) {
>   console.log(item); // 'a', 'b', 'c'
> }
> ```



## 调用 Iterator 接口的场合

### (1) 解构赋值

### (2) 扩展运算符

> 实际上，这提供了一种简便机制，可以将任何部署了 Iterator 接口的数据结构，转为数组。也就是说，只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组。

### (3) *yield\**

### (4) 其他场合

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。

- for...of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()（比如`new Map([['a',1],['b',2]])`）
- Promise.all()
- Promise.race()



## 字符串的 Iterator 接口

## Iterator 接口与 Generator 函数




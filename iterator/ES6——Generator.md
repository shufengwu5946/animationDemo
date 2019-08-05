# Generator函数

## 概念

* ES6 提供的一种异步编程解决方案
* Generator 函数是一个状态机，封装了多个内部状态。
* 执行 Generator 函数会返回一个遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。
* Generator 函数形式特征
  * `function`关键字与函数名之间有一个星号
  * 函数体内部使用`yield`表达式

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

### yield 表达式

由于 Generator 函数返回的遍历器对象，只有调用`next`方法才会遍历下一个内部状态，所以其实提供了一种**可以暂停执行的函数**。`yield`表达式就是暂停标志。



遍历器对象的`next`方法的运行逻辑如下。

（1）遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值。

（2）下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式。

（3）如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回的对象的`value`属性值。

（4）如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`。



`yield`表达式与`return`语句异同：

* 都能返回紧跟在语句后面的那个表达式的值。
* 区别在于每次遇到`yield`，函数暂停执行，下一次再从该位置继续向后执行，而`return`语句不具备位置记忆的功能。
* 一个函数里面，只能执行一次（或者说一个）`return`语句，但是可以执行多次（或者说多个）`yield`表达式。



Generator 函数可以不用`yield`表达式，这时就变成了一个单纯的暂缓执行函数。

> `yield`表达式只能用在 Generator 函数里面，用在其他地方都会报错。

> `yield`表达式如果用在另一个表达式之中，必须放在圆括号里面。
>
> ```javascript
> function* demo() {
>   console.log('Hello' + yield); // SyntaxError
>   console.log('Hello' + yield 123); // SyntaxError
> 
>   console.log('Hello' + (yield)); // OK
>   console.log('Hello' + (yield 123)); // OK
> }
> ```

>  `yield`表达式用作函数参数或放在赋值表达式的右边，可以不加括号。
>
> ```javascript
> function* demo() {
>   foo(yield 'a', yield 'b'); // OK
>   let input = yield; // OK
> }
> ```



### 与 Iterator 接口的关系

由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的`Symbol.iterator`属性，从而使得该对象具有 Iterator 接口。

```javascript
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]
```

上面代码中，Generator 函数赋值给`Symbol.iterator`属性，从而使得`myIterable`对象具有了 Iterator 接口，可以被`...`运算符遍历了。



## next 方法的参数

`yield`表达式本身没有返回值，或者说总是返回`undefined`。`next`方法可以带一个参数，该参数就会被当作上一个`yield`表达式的返回值。

```javascript
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

这个功能有很重要的语法意义。可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。



## for...of 循环

* `for...of`循环可以自动遍历 Generator 函数运行时生成的`Iterator`对象，且此时不再需要调用`next`方法。

  ```javascript
  function* objectEntries(obj) {
    let propKeys = Reflect.ownKeys(obj);
  
    for (let propKey of propKeys) {
      yield [propKey, obj[propKey]];
    }
  }
  
  let jane = { first: 'Jane', last: 'Doe' };
  
  for (let [key, value] of objectEntries(jane)) {
    console.log(`${key}: ${value}`);
  }
  // first: Jane
  // last: Doe
  ```

* 加上遍历器接口的另一种写法是，将 Generator 函数加到对象的`Symbol.iterator`属性上面。

  ```javascript
  function* objectEntries() {
    let propKeys = Object.keys(this);
  
    for (let propKey of propKeys) {
      yield [propKey, this[propKey]];
    }
  }
  
  let jane = { first: 'Jane', last: 'Doe' };
  
  jane[Symbol.iterator] = objectEntries;
  
  for (let [key, value] of jane) {
    console.log(`${key}: ${value}`);
  }
  // first: Jane
  // last: Doe
  ```

除了`for...of`循环以外，扩展运算符（`...`）、解构赋值和`Array.from`方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。

```javascript
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// 扩展运算符
[...numbers()] // [1, 2]

// Array.from 方法
Array.from(numbers()) // [1, 2]

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```

## Generator.prototype.throw()

* Generator 函数返回的遍历器对象，都有一个`throw`方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

* 如果 Generator 函数内部没有部署`try...catch`代码块，那么`throw`方法抛出的错误，将被外部`try...catch`代码块捕获。
* `throw`方法抛出的错误要被内部捕获，前提是必须至少执行过一次`next`方法。

* `throw`方法被捕获以后，会附带执行下一条`yield`表达式。也就是说，会附带执行一次`next`方法。

* Generator 函数体外抛出的错误，可以在函数体内捕获；反过来，Generator 函数体内抛出的错误，也可以被函数体外的`catch`捕获。

* 一旦 Generator 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。

## Generator.prototype.return()

`return`方法，可以返回给定的值，并且终结遍历 Generator 函数。

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

如果`return`方法调用时，不提供参数，则返回值的`value`属性为`undefined`。

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return() // { value: undefined, done: true }
```

如果 Generator 函数内部有`try...finally`代码块，且正在执行`try`代码块，那么`return`方法会推迟到`finally`代码块执行完再执行。

```javascript
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```



## next()、throw()、return() 的共同点

都是让 Generator 函数恢复执行，并且使用不同的语句替换`yield`表达式。

* `next()`是将`yield`表达式替换成一个值。
* `throw()`是将`yield`表达式替换成一个`throw`语句
* `return()`是将`yield`表达式替换成一个`return`语句

## yield* 表达式

ES6 提供了`yield*`表达式，作为解决办法，用来在一个 Generator 函数里面执行另一个 Generator 函数。
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

```javascript
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
  return 4;
};

[...myIterable] // [1, 2, 3],因为4的时候，done为true
```

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

```javascript
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5，因为6的时候，done为true
```

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

`yield*`后面的 Generator 函数（没有`return`语句时），等同于在 Generator 函数内部，部署一个`for...of`循环。

任何数据结构只要有 Iterator 接口，就可以被`yield*`遍历。

如果被代理的 Generator 函数有`return`语句，那么就可以向代理它的 Generator 函数返回数据。

```javascript
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}

function* bar() {
  yield 1;
  var v = yield* foo();
  console.log("v: " + v);
  yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```



## 作为对象属性的 Generator 函数

如果一个对象的属性是 Generator 函数，可以简写成下面的形式。

```javascript
let obj = {
  * myGeneratorMethod() {
    ···
  }
};
```

等价于

它的完整形式如下，与上面的写法是等价的。

```javascript
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
```



## Generator 函数的this

Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的`prototype`对象上的方法。

```javascript
function* g() {}

g.prototype.hello = function () {
  return 'hi!';
};

let obj = g();

obj instanceof g // true
obj.hello() // 'hi!'
```

>  如果把Generator 函数当作普通的构造函数，并不会生效，因为Generator 函数返回的总是遍历器对象，而不是`this`对象。

```javascript
function* g() {
  this.a = 11;
}

let obj = g();
obj.next();
obj.a // undefined
```

> Generator 函数也不能跟`new`命令一起用，会报错。

## 含义

### Generator 与状态机

### Generator 与协程

暂时略

### Generator 与上下文



## 应用

### 异步操作的同步化表达

例子：

```javascript
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}
var loader = loadUI();
// 加载UI
loader.next()

// 卸载UI
loader.next()
```

```javascript
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}

var it = main();
it.next();
```

### 控制流管理

### 部署 Iterator 接口

### 作为数据结构



# Generator 函数的异步应用

## Thunk 函数

Thunk 函数是自动执行 Generator 函数的一种方法。

### Thunk 函数的含义

编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。

### JavaScript 语言的 Thunk 函数

在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。

经过转换器处理，它变成了一个单参数函数，只接受回调函数作为参数。这个单参数版本，就叫做 Thunk 函数。

### Thunkify 模块

生产环境的转换器，建议使用 Thunkify 模块。

首先是安装。

```bash
$ npm install thunkify
```

使用方式如下。

```javascript
var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('package.json')(function(err, str){
  // ...
});
```

### Generator 函数的流程管理

### Thunk 函数的自动流程管理

```javascript
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

function* g() {
  // ...
}

run(g);
```

```javascript
var g = function* (){
  var f1 = yield readFileThunk('fileA');
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
};

run(g);
```

## co 模块

使用 co 的前提条件是，Generator 函数的`yield`命令后面，只能是 Thunk 函数或 Promise 对象

### 基于 Promise 对象的自动执行

```javascript
var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

```javascript
var g = gen();

g.next().value.then(function(data){
  g.next(data).value.then(function(data){
    g.next(data);
  });
});
```

理解了这一点，就可以写出一个自动执行器。

```javascript
function run(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }

  next();
}

run(gen);
```



### 处理并发的异步操作

co 支持并发的异步操作，即允许某些操作同时进行，等到它们全部完成，才进行下一步。

这时，要把并发的操作都放在数组或对象里面，跟在`yield`语句后面。

```javascript
// 数组的写法
co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ];
  console.log(res);
}).catch(onerror);

// 对象的写法
co(function* () {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2),
  };
  console.log(res);
}).catch(onerror);
```


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

暂时略

### (4) 其他场合

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。

- for...of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()（比如`new Map([['a',1],['b',2]])`）
- Promise.all()
- Promise.race()



## 字符串的 Iterator 接口

## Iterator 接口与 Generator 函数

暂时略

## 遍历器对象的 return()，throw()

自己写遍历器对象生成函数，那么`next`方法是必须部署的，`return`方法和`throw`方法是否部署是可选的。

### return()

`return`方法的使用场合是，如果`for...of`循环提前退出（通常是因为出错，或者有`break`语句），就会调用`return`方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署`return`方法。

举例

```javascript
function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false };
        },
        return() {
          file.close();
          return { done: true };
        }
      };
    },
  };
}

// 情况一
for (let line of readLinesSync(fileName)) {
  console.log(line);
  break;
}

// 情况二
for (let line of readLinesSync(fileName)) {
  console.log(line);
  throw new Error();
}
```

> 注意，`return`方法必须返回一个对象，这是 Generator 规格决定的

### throw()

暂时略

## for...of 循环

一个数据结构只要部署了`Symbol.iterator`属性，就被视为具有 iterator 接口，就可以用`for...of`循环遍历它的成员。

### 数组

* `for...of`循环可以代替数组实例的`forEach`方法。

* JavaScript 原有的`for...in`循环，只能获得对象的键名，不能直接获取键值。

  ES6 提供`for...of`循环，允许遍历获得键值。

  如果要通过`for...of`循环，获取数组的索引，可以借助数组实例的`entries`方法和`keys`方法。

  ```javascript
  var arr = ['a', 'b', 'c', 'd'];
  
  for (let a in arr) {
    console.log(a); // 0 1 2 3
  }
  
  for (let a of arr) {
    console.log(a); // a b c d
  }
  ```

  ```javascript
  for (let index of ['a', 'b'].keys()) {
    console.log(index);
  }
  // 0
  // 1
  
  for (let elem of ['a', 'b'].values()) {
    console.log(elem);
  }
  // 'a'
  // 'b'
  
  for (let [index, elem] of ['a', 'b'].entries()) {
    console.log(index, elem);
  }
  // 0 "a"
  // 1 "b"
  ```

* `for...of`循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性

  ```javascript
  let arr = [3, 5, 7];
  arr.foo = 'hello';
  
  for (let i in arr) {
    console.log(i); // "0", "1", "2", "foo"
  }
  
  for (let i of arr) {
    console.log(i); //  "3", "5", "7"
  }
  ```

### Set 和 Map 结构

```javascript
var engines = new Set(["Gecko", "Trident", "Webkit", "Webkit"]);
for (var e of engines) {
  console.log(e);
}
// Gecko
// Trident
// Webkit

var es6 = new Map();
es6.set("edition", 6);
es6.set("committee", "TC39");
es6.set("standard", "ECMA-262");
for (var [name, value] of es6) {
  console.log(name + ": " + value);
}
// edition: 6
// committee: TC39
// standard: ECMA-262
```

### 计算生成的数据结构

ES6 的数组、Set、Map 都部署了entries()、keys()、values()三个方法，调用后都返回遍历器对象。

> Set中entries()， 键名和键值相同

### 类似数组的对象

`for...of`循环可用于：

```javascript
// 字符串
let str = "hello";

for (let s of str) {
  console.log(s); // h e l l o
}

// DOM NodeList对象
let paras = document.querySelectorAll("p");

for (let p of paras) {
  p.classList.add("test");
}

// arguments对象
function printArgs() {
  for (let x of arguments) {
    console.log(x);
  }
}
printArgs('a', 'b');
// 'a'
// 'b'
```

> 对于字符串来说，`for...of`循环还有一个特点，就是会正确识别 32 位 UTF-16 字符。

> 并不是所有类似数组的对象都具有 Iterator 接口，可以使用`Array.from`方法将其转为数组，就可以采用for...of遍历。

### 对象

对于普通的对象，`for...of`结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。但是，这样情况下，`for...in`循环依然可以用来遍历键名。

* 使用`Object.keys`方法将对象的键名生成一个数组，然后遍历这个数组。

* 另一个方法是使用 Generator 函数将对象重新包装一下。（暂时略）

### 与其他遍历语法的比较

forEach 缺点：

* 无法中途跳出`forEach`循环，`break`命令或`return`命令都不能奏效。

`for...in`循环有几个缺点：

- 数组的键名是数字，但是`for...in`循环是以字符串作为键名“0”、“1”、“2”等等。
- `for...in`循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
- 某些情况下，`for...in`循环会以任意顺序遍历键名。

`for...of`循环优点：

- 有着同`for...in`一样的简洁语法，但是没有`for...in`那些缺点。
- 不同于`forEach`方法，它可以与`break`、`continue`和`return`配合使用。
- 提供了遍历所有数据结构的统一操作接口。
// class RangeIterator {
//   constructor(start, end) {
//     this.value = start;
//     this.end = end;
//   }

//   [Symbol.iterator]() {
//     console.log(this);

//     const that = this;
//     return {
//       next() {
//         if (that.value < that.end) {
//           return { value: that.value++ };
//         } else {
//           return { done: true };
//         }
//       },
//       return() {
//         console.log("return");
//         return { done: true };
//       }
//     };
//   }
// }

// for (let value of new RangeIterator(0, 7)) {
//   console.log(value);
//   if (value === 4) {
//     throw new Error();
//   }
// }

// const obj = {
//   data: ["hello", "world"],
//   [Symbol.iterator]() {
//     const that = this;
//     let index = 0;
//     return {
//       next() {
//         if (index < that.data.length) {
//           return { value: that.data[index++] };
//         } else {
//           return { done: true };
//         }
//       }
//     };
//   }
// };

// for (const value of obj) {
//   console.log(value);
// }

// let iterable = {
//   0: "a",
//   1: "b",
//   2: "c",
//   length: 3,
//   [Symbol.iterator]: Array.prototype[Symbol.iterator]
// };
// for (let item of iterable) {
//   console.log(item); // 'a', 'b', 'c'
// }

// let set = new Set().add('a').add('b').add('c');

// let [x,y] = set;
// // x='a'; y='b'

// let [first, ...rest] = set;
// console.log(x,y,first,rest);

// for (let index of ["a", "b"].keys()) {
//   console.log(index);
// }
// // 0
// // 1

// for (let elem of ["a", "b"].values()) {
//   console.log(elem);
// }
// // 'a'
// // 'b'

// for (let [index, elem] of ["a", "b"].entries()) {
//   console.log(index, elem);
// }

// [1, 2, 3, 4, 5, 6].forEach(function(value) {
//   console.log(value);
//   //   break;
// });

// for (const k in ["hehe", "haha", "666"]) {
//   console.log(k);
// }

// function* helloWorldGenerator() {
//   console.log("hello1");
//   console.log("hello2");
//   yield "hello";
//   console.log("hello3");
//   console.log("hello4");
//   yield "world";
//   console.log("hello5");
//   console.log("hello6");
//   return "ending";
// }

// var hw = helloWorldGenerator();
// console.log([...hw]);

// function* gen() {
//   var url = "https://api.github.com/users/github";
//   var result = yield fetch(url);
//   console.log(result.bio);
// }
// var g = gen();
// var result = g.next();

// result.value
//   .then(function(data) {
//     return data.json();
//   })
//   .then(function(data) {
//     g.next(data);
//   });

/**
 * node 环境测试
 */
// var fs = require("fs");
// var thunkify = require("thunkify");
// var co = require("co");
// var path = require("path");
// var readFileThunk = thunkify(fs.readFile);

// var g = function*() {
//   console.log("start");
//   var f1 = yield readFileThunk(path.join(__dirname,'./index.html'));
//   console.log("f1");
//   var f2 = yield readFileThunk(path.join(__dirname,'./index.html'));
//   console.log("f2");
//   var f2 = yield readFileThunk(path.join(__dirname,'./index.html'));
//   console.log("f3");
//   var f2 = yield readFileThunk(path.join(__dirname,'./index.html'));
//   console.log("f4");
//   var f2 = yield readFileThunk(path.join(__dirname,'./index.html'));
//   console.log("f5");
// };

// thunk 自动执行器
// function run(fn) {
//   var gen = fn();

//   function next(err, data) {
//     var result = gen.next(data);
//     if (result.done) return;
//     result.value(next);
//   }

//   next();
// }

// run(g)

// co(g)
//   .then(function() {
//     console.log("Generator 函数执行完成");
//   })
//   .catch(function(e) {
//     console.log(e);
//   });


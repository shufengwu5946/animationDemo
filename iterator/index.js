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
//       }
//     };
//   }
// }

// for (let value of new RangeIterator(0, 7)) {
//   console.log(value);
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

let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
console.log(x,y,first,rest);


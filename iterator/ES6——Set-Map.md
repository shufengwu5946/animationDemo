# Set 和 Map

## Set

* 通过`add()`方法向 Set 结构加入成员
* `Set`函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
* 向 Set 加入值的时候，不会发生类型转换，所以`5`和`"5"`是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（`===`），主要的区别是向 Set 加入值时认为`NaN`等于自身，而精确相等运算符认为`NaN`不等于自身。
* 由于两个空对象不相等，所以它们被视为两个值。

### Set 实例的属性和方法

- `Set.prototype.constructor`：构造函数，默认就是`Set`函数。
- `Set.prototype.size`：返回`Set`实例的成员总数。

操作方法：

- `Set.prototype.add(value)`：添加某个值，返回 Set 结构本身。
- `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
- `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为`Set`的成员。
- `Set.prototype.clear()`：清除所有成员，没有返回值。

`Array.from`方法可以将 Set 结构转为数组。

### 遍历操作

- `Set.prototype.keys()`：返回键名的遍历器
- `Set.prototype.values()`：返回键值的遍历器
- `Set.prototype.entries()`：返回键值对的遍历器
- `Set.prototype.forEach()`：使用回调函数遍历每个成员



如果想在遍历操作中，同步改变原来的 Set 结构，目前没有直接的方法，但有两种变通方法。一种是利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构；另一种是利用`Array.from`方法。

```javascript
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6
```



## WeakSet

* 首先，WeakSet 的成员只能是对象，而不能是其他类型的值。

* 其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

ES6 规定 WeakSet 不可遍历。



WeakSet 结构有以下三个方法。

- **WeakSet.prototype.add(value)**：向 WeakSet 实例添加一个新成员。
- **WeakSet.prototype.delete(value)**：清除 WeakSet 实例的指定成员。
- **WeakSet.prototype.has(value)**：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。

WeakSet 没有`size`属性，没有办法遍历它的成员



## Map

> JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键

* “键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

* 作为构造函数，Map 也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。

  ```javascript
  const map = new Map([
    ['name', '张三'],
    ['title', 'Author']
  ]);
  
  map.size // 2
  map.has('name') // true
  map.get('name') // "张三"
  map.has('title') // true
  map.get('title') // "Author"
  ```

* 不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构（详见《Iterator》一章）都可以当作`Map`构造函数的参数。
* 如果对同一个键多次赋值，后面的值将覆盖前面的值。
* 如果读取一个未知的键，则返回`undefined`

> 注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。

* Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。

* 如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如`0`和`-0`就是一个键，布尔值`true`和字符串`true`则是两个不同的键。另外，`undefined`和`null`也是两个不同的键。虽然`NaN`不严格相等于自身，但 Map 将其视为同一个键。

### 实例的属性和操作方法

#### **(1) size 属性**

#### **(2) Map.prototype.set(key, value)**

`set`方法返回的是当前的`Map`对象，因此可以采用链式写法。

#### **(3) Map.prototype.get(key)**

#### **(4) Map.prototype.has(key)**

#### **(5) Map.prototype.delete(key)**

`delete`方法删除某个键，返回`true`。如果删除失败，返回`false`。

#### **(6) Map.prototype.clear()**

`clear`方法清除所有成员，没有返回值。



### 遍历方法

Map 结构原生提供三个遍历器生成函数和一个遍历方法。

- `Map.prototype.keys()`：返回键名的遍历器。
- `Map.prototype.values()`：返回键值的遍历器。
- `Map.prototype.entries()`：返回所有成员的遍历器。
- `Map.prototype.forEach()`：遍历 Map 的所有成员。

Map 的遍历顺序就是插入顺序。

Map 结构转为数组结构，比较快速的方法是使用扩展运算符（`...`）。



### Map与数组、对象、json的相互转化



## WeakMap

* 首先，`WeakMap`只接受对象作为键名（`null`除外），不接受其他类型的值作为键名。
* WeakMap 的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

WeakMap 与 Map 在 API 上的区别主要是两个：

一是没有遍历操作（即没有`keys()`、`values()`和`entries()`方法），也没有`size`属性。二是无法清空，即不支持`clear`方法。

二是无法清空，即不支持`clear`方法。
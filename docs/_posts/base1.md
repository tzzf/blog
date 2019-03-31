---
tags:
  - base
date: 2019-03-25
title: 一道题目引发的思考
vssue-title: 一道题目引发的思考
---

一道题目引发的思考

<!-- more -->

```
  let spaceship = {
    homePlanet : 'Earth',
    color : 'red'
  };
  let tryReassignment = obj => {
    obj = {
    identified : false, 
    'transport type' : 'flying'
    }
    console.log(obj) // {'identified': false, 'transport type': 'flying'}
  };
  tryReassignment(spaceship)
  console.log(spaceship) // {homePlanet: "Earth", color: "red"}
```
为什么在函数内改变参数的值，看上去改变成功，但其实并没有改变成功。
<br />
那么从头开始讲这是为什么？
> JavaScript有5种基本的数据类型，分别是：布尔、null、undefined、String和Number，还有引用类型值，分别是 Array、Function和Object。
<br />
这俩种数据类型在值绑定的过程区别是很大的，像基本数据类型，在变量赋值过程中就是讲这个值绑定到这个变量上，但是引用类型值则不同，它是讲这个值所对应的内存地址绑定给这个变量。这种不同的赋值方式分别叫值传递和引用传递。
<br />
下面用表格的方式来描述下
```
var obj = {}; // 步骤一
obj.val = 'value'; // 步骤二
var newObj = obj; // 步骤三
```
// 步骤一时
|    变量    |       地址       |      值     |
|:-------:|:-------------: | :----------:|
|   obj  |     #001    |   {}   |
// 步骤二时
|    变量    |       地址       |      值     |
|:-------:|:-------------: | :----------:|
|   obj  |     #001    |   {val: 'value'}   |
// 步骤三时
|    变量    |       地址       |      值     |
|:-------:|:-------------: | :----------:|
|   obj  |     #001    |   {val: 'value'}   |
|   newObj  |     #001    | |
可以看出obj的地址时一直没变的，当obj被赋值给另一个变量时它只是将地址传递给另一个变量，这就是引用传递。
<br />
明白了引用传递和值传递，那么你就会这两个和上面的题目有上面关系呢？下面就开始讲讲两者的关系。
<br />
JS函数的参数与大多数其他语言中函数的参数有所不同，JS函数不介意传递进来多少个参数，也不在乎传递进来的参数是什么数据类型。也就是说，即便你定义的函数只接收两个参数，在调用这个函数也未必一定要传递两个参数。可以传递一个，三个甚至不传递参数，而解析器永远也不会有什么怨言。原因是JavaScript中的参数在内部是用一个数组来表示的。**函数接受到始终是这个数组，而不关心数组包含多少元素和参数。**实际上在函数体内可以通过arguments对象来访问这个参数数组，从而获取传递给函数的每一个参数。
<br />
js是数组类型来接受参数，那么下面就画个上面题目的示意图：
|    变量    |       地址       |      值     |
|:-------:|:-------------: | :----------:|
|   spaceship  |     #001    |   {homePlanet: "Earth", color: "red"}   |
|   obj（参数）  |     #001    |    |
在函数内部，obj进行一次变量赋值，obj是对象类型，因为是引用传递，所以将obj的地址换了一个新的地址
|    变量    |       地址       |      值     |
|:-------:|:-------------: | :----------:|
|   obj（参数）  |     #002   |   {'identified': false, 'transport type': 'flying'}   |
但是由于是地址更换了，并未对之前地址的值对修改，所以未改变传的值。
<br />
当然有人觉得传值也是可以理解的，因为值被赋值到了另一个对象里而已，那么怎么证明是传的是地址呢？下面再出一题改的是地址的值
```
var a = {
    key: 'name',
    value: 2121
}
var handleValue = (obj) => {
    obj.key = 'otherKey';
    console.log(obj); // {key: "otherKey", value: 2121}
}
handleValue(a);
console.log(a); // {key: "otherKey", value: 2121}
```
这题中handleValue函数参数传的是{key: "name", value: 2121}的地址，在函数内部将改地址对应的值修改了，所以最开始定义的变量也被修改了
<br />
那么我们也可以开始实验，将参数的地址换一个而不是之前的a所对应的地址，那么怎么修改呢？当然是用深拷贝啊。
```
function deepCopy (source) {
  const result = source.constructor === Array ? [] : {}; // 用三目运算判断他是数组还是对象
  for (const key in source) {
    if (typeof source[key] === 'object') {
      result[key] = deepCopy(source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};
var a = {
    key: 'name',
    value: 2121
}
var handleValue = (obj) => {
    console.log(obj); // {key: "name", value: 2121}
    obj.key = 'otherKey';
    console.log(obj); // {key: "otherKey", value: 2121}
}
handleValue(deepCopy(a));
console.log(a); // {key: "name", value: 2121}
```
a并没有修改，但是在函数内部的参数obj已经被修改，正是说明参数obj所对应的地址已被修改，只是这次obj对应的地址并不是和之前的a所对应的地址一样了。

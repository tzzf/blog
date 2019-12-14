---
tags:
  - flutter
date: 2019-12-14
title: flutter 动画入门
vssue-title: flutter 动画入门
---

flutter 动画入门

<!-- more -->
在学习flutter的动画之前，先复习一下css的动画。我觉得两者是有点相似的。那么开始复习css的动画了。
<br />
css的动画有transition（过渡）和animation（动画）。
<br>
<h4>transition</h4>
css transition由transition-property(指定哪些属性变化时会有过渡效果) transition-duration(过渡的时长) transition-timing-function(过渡的变化效果 比如linear线性变化) transition-delay(指定延迟 多久后执行过渡效果)组成。
<br>
那么知道了组成我们来一个动画效果吧
<br>

```
<div class="box">Lorem</div>

.box {
  width: 100px;
  height: 100px;
  background: red;
  transition: 1s 0s transform ease;
}

.box:hover {
  transform: translateY(10px);
}

```

<br>
这样就实现了一个简单向下移动的动画。
<br/>
那么在flutter中是否也这些属性，显然大部分是有的。那么开始介绍在flutter中是怎么实现这些属性的。
<br>
flutter 有个核心类（Animation）来指导动画的值。
<br />
首先要创建一个AnimationController
<br>

```
final AnimationController controller = new AnimationController(duration: const Duration(milliseconds: 2000), vsync: this);
```

<br>
在创建的时候也可以定义这个动画时长。也就是transition-duration。但是这里有区别的是，这里还需要定一个reverseDuration（此动画在反向播放时应持续的时间长度）时长,不设置的话，取duration时长。
<br>
然后就是定义一下动画的变化曲线。
<br>

```
final CurvedAnimation curve = new CurvedAnimation(parent: controller, curve: Curves.easeIn);
```

<br>
当然这个你也可以自己创建一种变化曲线.
<br>
接着就是定义一下动画的变化幅度
<br>

```
final Tween doubleTween = new Tween<double>(begin: Offset(0.0, 0.0), end: Offset(0.0, 50.0));
```

<br>
这个仅仅只是定义了变化的幅度，你还需要将这些值赋值到你想这个变化的那个属性上（transition-property），比如你要将这个图片上下移动，你就需要这样赋值。
<br>

```
Transform.translate(
    offset: doubleTween.value,
    child: Image.asset(
        this.img,
        width: 100,
    ),
),
```
<br>
当然Tween不仅仅只能变化值，还可以变化颜色等等。
<br>

```
final Tween colorTween = new ColorTween(begin: Colors.transparent, end: Colors.black54)
```

<br>
其他的变化可以参考文档[Twwen](https://api.flutter.dev/flutter/animation/Tween-class.html)。Tween有个缺点就是只有begin end，所以如果需要实现css的animation的自定义动画效果，就需要多段动画接连执行。
<br>
最后就是让这个动画开始
<br>

```
animationController.forward(); // 执行一次动画。
```

<br>
但是这只是执行一个动画如果要动画重复执行就需要监听动画的状态。
<br>

```
animationController.addStatusListener((AnimationStatus status) {
    if (status == AnimationStatus.completed) {
    animationController.reverse();
    } else if (status == AnimationStatus.dismissed) {
    animationController.forward();
    }
});
```

<br>
如上就是flutter的简单动画。下面就上一下全部代码
<br>

```
import 'package:flutter/material.dart';
import 'package:flutter/animation.dart';

class AnimPage2 extends StatefulWidget {
  AnimPage2({Key key, this.img, this.width}) : super(key: key);
  String img;
  int width;
  @override
  State<StatefulWidget> createState() {
    return _AnimPage2();
  }
}

class _AnimPage2 extends State<AnimPage2> with TickerProviderStateMixin {
  var w = 100.0;
  var h = 100.0;

  String img;
  int width;

  Animation<Offset>  animation;
  Animation<Offset>  animationback;
  AnimationController animationController;

  @override
  void initState() {
    super.initState();
    img = widget.img;
    width = widget.width;
    // 创建 AnimationController，用于控制动画
    // 必须提供动画时间
    // animationController = new AnimationController(vsync: this, duration: Duration(milliseconds: 1500));
    // // 创建一个插值器，关联 AnimationController，返回一个新的 Animation 对象
    // animation = Tween<double>(begin: 100.0, end: 100.0 * 2.0).animate(animationController);

    animationController = new AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1000),
      reverseDuration: Duration(milliseconds: 3000),
    );
    final CurvedAnimation curve = new CurvedAnimation(parent: animationController, curve: Curves.easeIn);
    animation = new Tween<Offset>(begin: const Offset(0.0, 0.0), end: const Offset(0.0, 50.0)).animate(curve);
    animationController.addListener(() {
      setState(() {});
    });

    animationController.addStatusListener((AnimationStatus status) {
      if (status == AnimationStatus.completed) {
        animationController.reverse();
      } else if (status == AnimationStatus.dismissed) {
        animationController.forward();
      }
    });
    // 开始播放动画
    animationController.forward();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.topCenter,
      child: Transform.translate(
        offset: animation.value,
        child: Image.asset(
          this.img,
          width: 100,
        ),
      ),
      width: 200,
    );
  }

  @override
  void dispose() {
    // 动画使用完成后必需要销毁
    animationController.dispose();
    super.dispose();
  }
}

```

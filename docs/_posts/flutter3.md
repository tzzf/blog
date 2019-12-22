---
tags:
  - flutter
date: 2019-12-22
title: flutter 单例模式
vssue-title: flutter 单例模式
---

flutter 单例模式

<!-- more -->
在开发app的过程，如果有多处有需要播放音乐，但是手机的肯定只能播放一个音乐，所有就需要全局维护一个音乐实例。那么该怎么实现这种情况呢？
<br />
在软件设计模式中正好有一种模式可以实现这种功能。

<h3>单例模式</h3>

>实现单例模式的思路是：一个类能返回对象一个引用(永远是同一个)和一个获得该实例的方法（必须是静态方法，通常使用getInstance这个名称）；当我们调用这个方法时，如果类持有的引用不为空就返回这个引用，如果类保持的引用为空就创建该类的实例并将实例的引用赋予该类保持的引用；同时我们还将该类的构造函数定义为私有方法，这样其他处的代码就无法通过调用该类的构造函数来实例化该类的对象，只有通过该类提供的静态方法来得到该类的唯一实例。

那么来实现一下这个场景下的单例模式

```
import 'package:audioplayers/audioplayers.dart';

class MusicPlayer {
  factory MusicPlayer() =>_getInstance();
  static MusicPlayer get instance => _getInstance();
  static MusicPlayer _instance;
  AudioPlayer audioPlayer;
  MusicPlayer._internal() {
    print('初始化');
    // 初始化
    audioPlayer = new AudioPlayer();
  }
  static MusicPlayer _getInstance() {
    if (_instance == null) {
      _instance = new MusicPlayer._internal();
    }
    return _instance;
  }

  void playMusic() {
    print('playMusic');
    audioPlayer.play('');
  }
}
```
这个类在定义通过factory 关键字，让每次都创建该类的同时不创建一个新的实例，保证只创建一个实例。
<br />

>单例模式在多线程的应用场合下必须小心使用。如果当唯一实例尚未创建时，有两个线程同时调用创建方法，那么它们同时没有检测到唯一实例的存在，从而同时各自创建了一个实例，这样就有两个实例被构造出来，从而违反了单例模式中实例唯一的原则。 解决这个问题的办法是为指示类是否已经实例化的变量提供一个互斥锁(虽然这样会降低效率)。


虽然flutter是单线程，但是还是讲解下如何避免这种情况。先上代码。
<br >

```
class MusicPlayer {
  factory MusicPlayer() =>_sharedInstance();
  
  static MusicPlayer _instance = MusicPlayer._();

  AudioPlayer audioPlayer;

  MusicPlayer._() {
    print('初始化');
    audioPlayer = new AudioPlayer();
    // 具体初始化代码
  }

  static MusicPlayer _sharedInstance() {
    return _instance;
  }

  void playMusic() {
    print('playMusic');
    audioPlayer.play('');
  }
}
```

单例模式中又有分两种模式，一种叫饿汉模式(上一种代码)，另一种叫懒汉模式(上上种代码)。
<br>
从代码中可以看出两种初始化的时机不同，一种在factory函数执行的时候执行(懒汉模式)，另一种则是在变量定义的时候就执行了(饿汉模式)。所以饿汉模式就可以避免多线程在执行的时候，创建多个实例。
<br>
单例模式的介绍大致就是如此了。

>最近发布一个flutter插件（simple_component_z）,欢迎大家使用zz



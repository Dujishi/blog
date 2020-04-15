---
layout: post
title: 响应式系统的依赖收集追踪原理
categories: vue
description: 响应式系统的依赖收集追踪原理
keywords: 响应式
---


(一)、订阅者Dep:

```js
class Dep{
    constructor(){
        /* 用来存放 Watcher 对象的数组 */
        this.subs = []
    }

    /* 在 subs 中添加一个 Watcher 对象 */
    addSub(sub){
        this.subs.push(sub)
    }

    /* 遍历通知所有 Watcher 对象更新视图 */
    notify(){
        this.subs.forEach(sub=>{
            sub.update()
        })
    }
}
```

(二)、观察者Watcher :

```js
class Watcher{
    /* 在 new 一个 Watcher 对象时将该对象赋值给 Dep.target，在 get 中会用到 */
    constructor(){
        Dep.target = this
    }

    update(){
        console.log('视图更新~')
    }
}
```

(三)、依赖收集:

```js

function defineReactive(obj,key,val){

    /* 定义一个Dep类对象 */
    const dep = new Dep()

    Object.defineProperty(obj,key,{
        enumerable:true,
        configurable:true,
        get:function(){
            /* 将 Dep.target(即当前的 Watcher 对象存入 dep 的 subs 中) */
            dep.addSub(Dep.target)
            return val
        },
        set:function(newVal){
            if(newVal === val) return 
            /* 在 set 的时候触发 dep 的 notify 来通知所有的 Watcher 对象更新视图 */
            dep.notify()
        }
    })
}
```

```js
function observer(value){
    if(!value || (typeof value!== 'object')) return ;
    Object.keys(value).forEach(key=>{
        defineReactive(value,key,value[key])
    })
}
```

```js
class Vue{
    constructor(options){
        this._data = options
        observer(this._data)
        /* 新建一个 Watcher 观察者对象，这时候 Dep.target 会指向这个 Watcher 对象 */
        new Watcher()
        /* 在这里模拟 render 的过程，为了触发 test 属性的 get 函数 */ 
        console.log('render~', this._data.test);
    }
}
```

(四)、总结：

```text
首先在 observer 的过程中会注册 get 方法，该方法用来进行「 依赖收集」。
在它的闭包中会有一个 Dep 对象，这个对象用来存放 Watcher 对象的实例。
其实「 依赖收集」的过程就是把 Watcher 实例存放到对 应的Dep对象中去。get方法可以让当前的Watcher对象(Dep.target)存放到它的 subs 中(addSub) 方法，在数据变化时，set 会调用 Dep 对象的 notify 方法通知它内部所有的 Watcher 对象进行视图更新。

这是 Object.defineProperty 的 set/get 方法处理的事情，那么「 依赖收集」的前提条件还有两个:
1. 触发 get 方法;
2. 新建一个 Watcher 对象。

这个我们在 Vue 的构造类中处理。新建一个Watcher对象只需要 new 出来，这时候Dep.target已经 指向了这个 new 出来的Watcher对象来。而触发get方法也很简单，实际上只要把 renderfunction 进行渲染，那么其中的依赖的对象都会被「读取」，这里我们通过打印来模拟这个过程，读取 test 来触 发 get 进行「依赖收集」。

一句话：就是 get 进行「依赖收集」。 set 通过观察者来更新视图。

![](/blog/images/posts/js/vue-compile.png)
---
layout: post
title: Vuex核心思想及实现简易的vuex
categories: Vuex
description: 实现简易版本Vuex
keywords: Vuex简易
---

## Vuex是什么

> Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。
>
> ——Vuex官网

![](/blog/images/posts/js/vuex.png)

## Vuex 核心思想

Vuex 应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的状态 (state),只不过它的数据是存储在内存中，页面刷新即消失。

Vuex 和单纯的全局对象有以下两点不同：

Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

另外，通过定义和隔离状态管理中的各种概念并强制遵守一定的规则，我们的代码将会变得更结构化且易维护。


## 实现简易版的Vuex

讲完核心思想，我们就可以动手实现一个简易的Vuex了，主要功能代码如下：

```js
let Vue;
class Store {
    constructor(options = {}) {
        this.vm = new Vue({
            data: {
                state: options.state
            }
        })
        let getters = options.getters;

        this.getters = {}
        Object.keys(getters).forEach(getterName => {
            Object.defineProperty(this.getters, getterName, {
                get: () => {
                    return getters[getterName](this.state)
                }
            })
        })
        let mutations = options.mutations || {}
        this.mutations = {}
        Object.keys(mutations).forEach(mutaitonName => {
            this.mutations[mutaitonName] = payload => {
                mutations[mutaitonName](this.state, payload);
            }
        })
        let actions = options.actions || {}
        this.actions = {}
        Object.keys(actions).forEach(actionName => {
            this.actions[actionName] = payload => {
                actions[actionName](this, payload);
            }
        })
    }
    commit = (method, payload) => {
        this.mutations[method](payload);
    }
    dispatch(method, payload) {
        this.actions[method](payload)
    }
    get state() {
        return this.vm.state
    }
}

const install = (_Vue) => {
    Vue = _Vue;
    Vue.mixin({
        beforeCreate() {
            if(this.$options && this.$options.store) {
                // 给根实例增加$store属性
                this.$store = this.$options.store
            } else {
                // 有可能单独创建了一个实例没有父亲，那就无法获取到store属性
                this.$store = this.$parent && this.$parent.$store
            }
        }
    })
}
export default {
    install,
    Store
}
```

## 存在的问题

我们项目用vuex做全局状态管理，页面刷新后，仓库内的state被初始化。因为js代码运行在内存中，代码运行时，变量和函数都保存在内存中。在刷新操作中，以前的内存被释放，重新加载js脚本，变量被重新赋值。如何解决这个问题呢？

这里就需要依赖客户端的缓存，我们可以在页面刷新前将数据存储在内存外部（例：Local Storage、Session Storage、Index DB），刷新后从外部获取到存储的数据替换 store 的根状态。

页面刷新前将数据存储在sessionStorage
onbeforeunload 事件：监听离开当前页面(刷新或关闭)

```js

mounted() {
    window.onbeforeunload = (e) => {
      sessionStorage.setItem('demo_store', JSON.stringify(this.$store.state));
    }
}

```

刷新后从sessionStorage获取存储的数据替换 store 的根状态
replaceState:替换 store 的根状态，仅用状态合并或时光旅行调试

```js

created() {
    let sessionStore = sessionStorage.getItem('demo_store');
    sessionStore && this.$store.replaceState(JSON.parse(sessionStore));
}

```


## 参考链接

- <https://www.jianshu.com/p/87db06d5b84e>

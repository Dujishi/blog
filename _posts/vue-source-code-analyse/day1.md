---
layout: post
title: Vue源码分析(DAY1)
categories: Vue源码
description: Vue源码分析
keywords: Vue源码分析
---

# 响应式系统的基本原理
```js
基于Object.defineProperty

function cb(){
  //渲染视图
  console.log('视图更新啦')
}

function defineReactive(obj,key,val){
    Object.defineProperty(obj,key,{
      get(){
        return val
      }
    })
}

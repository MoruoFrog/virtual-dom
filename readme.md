## 试着写一个virtual-dom出来

先看自己能不能不借鉴别人的写出来，写完了再对比一下

不包含模板编译这一步

- [x] 确定描述UI的对象的数据结构
- [ ] diff
- [ ] patch
- [x] virtual-dom --> web DOM (web平台的render)
- [ ] virtual dom patch --> web DOM patch

1、确定描述UI的对象的数据结构

- [x] 构造函数

```javascript
  view = render(mode)
```

作为视图层的框架，react和vue的核心和功能其实就是一个渲染函数，一个把描述UI的javascript对象渲染成真实DOM的render。

那么一个怎样的数据结构就可以完整的描述UI了呢，其实很简单

```javascript
{
  name,
  props, // attribute + events
  children
}
```

2、virtual dom --> web dom
使用dom api完成即可

- [x] props不考虑事件
- [X] 绑定事件
- [ ] style对象语法，class

3、diff

- [x] diff, style是对象，有点麻烦，先不做对对style的diff。

4、patch

- [ ] patch
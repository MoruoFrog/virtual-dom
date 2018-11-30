# 试着写一个virtual-dom出来

不包含模板编译这一步

- [x] 确定描述UI的对象的数据结构
- [x] virtual-dom --> web DOM (web平台的render)
- [X] diff，不考虑顺序变化的情况
- [x] patch，不考虑顺序变化的情况
- [ ] diff列表顺序变化
- [ ] patch列表顺序变化

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
- [x] style对象语法，class

3、diff

- [x] diff, style是对象，有点麻烦
- [ ] 列表顺序变化

4、patch

我这个virtual-dom的结构和DOM结构完全一样，所以有同样的深度优先遍历顺序，根据这个来进行patch
并且不考虑顺序改变的情况

- [x] 基本的patch
- [ ] 考虑顺序改变（key）
/**
 * 参数参照react的createElement
 * 主要是为了以后可能用jsx，毕竟我现在还不会编译原理
 */

function VNode(name, props, children) {
  this.name = name
  this.$props = props || {}
  this.children = children || []
  this.realDom = null
  this.attributes = {}
  this.events = {}

  this.groupProps()
}

// 分离attributes和events
VNode.prototype.groupProps = function() {
  const props = this.$props

  Object.keys(props).forEach(key => {
    if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase()
      const eventHandler = props[key]

      if (this.events[eventName]) {
        this.events[eventName].push(eventHandler)
      } else {
        this.events[eventName] = [eventHandler]
      }
    } else {
      this.attributes[key] = props[key]
    }
  })
}

VNode.prototype.render = function() {
  const { name, attributes, events, children } = this
  const elm = document.createElement(name)

  // 添加属性
  Object.keys(attributes).forEach(key => {
    const prop = attributes[key]

    if (key === 'style') {
      Object.assign(elm.style, prop)
    } else if(key === 'className'){
      elm.className = prop
    } else {
      elm.setAttribute(key, prop)
    }
  })

  // 添加事件
  Object.keys(events).forEach(eventName => {
    const handlers = events[eventName]

    handlers.forEach(handler => elm.addEventListener(eventName, handler))
  })

  // 渲染子节点
  children.forEach(child => {
    let childNode
    if (child instanceof VNode) {
      childNode = child.render()
    } else {
      childNode = document.createTextNode(child)
    }

    elm.appendChild(childNode)
  })

  this.realDom = elm
  return elm
}

VNode.prototype.mount = function(target) {
  target.appendChild(this.realDom)
}
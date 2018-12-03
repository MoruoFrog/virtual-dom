import { groupProps, forOwn } from './utils'
import VNode from './vNode'

const WebDom = {}

WebDom.render = function(vNode, target) {
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode)
  }

  const { name, children } = vNode
  const { events, attributes } = groupProps(vNode)
  const elm = document.createElement(name)

  // 添加属性
  forOwn(attributes, (key, val) => {
    if (key === 'style') {
      Object.assign(elm.style, val)
    } else if(key === 'className'){
      elm.className = val
    } else {
      elm.setAttribute(key, val)
    }
  })

  // 添加事件
  forOwn(events, (eventName, handlers) => {
    handlers.forEach(handler => elm.addEventListener(eventName, handler))
  })

  // 渲染子节点
  children.forEach(child => {
    let childNode
    if (child instanceof VNode) {
      childNode = WebDom.render(child)
    } else {
      childNode = document.createTextNode(child)
    }

    elm.appendChild(childNode)
  })

  target && target.appendChild(elm)
  return elm
}

export default WebDom
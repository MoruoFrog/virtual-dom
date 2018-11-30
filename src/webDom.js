import { groupProps } from './utils'
import VNode from './vNode'

const WebDom = {}

WebDom.render = function(vNode, target) {
  const { name, children } = vNode
  const { events, attributes } = groupProps(vNode)
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
/**
 * 参数参照react的createElement
 * 主要是为了以后可能用jsx，毕竟我现在还不会编译原理
 */

function VNode(name, props, children) {
  this.name = name
  this.props = props || {}
  this.children = children || []
  this.realDom = null
}

VNode.prototype.render = function() {
  const { name, props, children } = this
  const elm = document.createElement(name)

  Object.keys(props).forEach(key => {
    elm.setAttribute(key, props[key])
  })

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
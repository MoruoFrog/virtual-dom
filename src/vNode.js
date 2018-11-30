/**
 * 参数参照react的createElement
 * 主要是为了以后可能用jsx，毕竟我现在还不会编译原理
 */

let uid = 0

function VNode(name, props, children) {
  this.name = name
  this.props = props || {}
  this.children = children || []
  this.uid = uid++
  this.patches = []
}


export default VNode
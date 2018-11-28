const REMOVE = 1
const PROPS = 2
const REPLACE = 3
const INSERT = 4
const TEXT = 5

/**
 * diff 两个VNode之间的差异并返回
 * vNode和doom一一对应，vNode有realDom属性(除了textNode)
 * @param {VNode} oldTree 
 * @param {VNode} newTree 
 */
const diff = (oldTree, newTree) => {
}
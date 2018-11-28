const REMOVE = 1
const PROPS = 2
const REPLACE = 3
const INSERT = 4
const TEXT = 5

/**
 * diff 两个VNode之间的差异并返回，不递归diff子节点
 * vNode和doom一一对应，vNode有realDom属性(除了textNode)
 * @param {VNode} oldNode 
 * @param {VNode} newNode 
 */
const diffNode = (oldNode, newNode) => {
  if (typeof oldNode === 'string' && typeof newNode === 'string'){
    if (oldNode !== newNode) {
      return [TEXT, newNode]
    }
    return false
  }

  if (oldNode.name !== newNode.name) {
    return [REPLACE, newNode]
  }

  const propsDiff = {}

  const oldProps = oldNode.props
  const newProps = newNode.props

  // 插入和修改prop
  Object.keys(newProps).forEach(key => {
    if (oldProps.hasOwnProperty(key)) {
      if (oldProps[key] !== newProps[key]) {
        propsDiff[key] = [REPLACE, newProps[key]]
      }
    } else {
      propsDiff[key] = [INSERT, newProps[key]]
    }
  })

  // 删除prop
  Object.keys(oldProps).forEach(key => {
    if (!newProps.hasOwnProperty(key)) {
      propsDiff[key] = [REMOVE]
    }
  })

  if (Object.keys(propsDiff).length === 0) return false

  return [2, propsDiff]
}

const diffTree = (oldTree, newTree) => {
  const result = []

  // 同步dfs两个树，需要注意保持同步
  // 已经有过经验了，递归dfs快于手动堆栈
  const dfsDiff = (tree1, tree2) => {
    const differenec = diffNode(tree1, tree2)
    if (differenec) result.push(differenec)

    const diffType = differenec[0]
    // 如果是替换或者文本节点，不用递归往下
    if ([REPLACE, TEXT].includes(diffType) || typeof tree1 === 'string') return

    const children1 = [...tree1.children]
    const children2 = [...tree2.children]
    const maxChildCount = Math.max(children1.length, children2.length)
    for(let i = 0; i < maxChildCount; i++) {
      // 插入
      if (i > children1.length - 1) {
        result.push([INSERT, children2[i]])
        continue
      }
      // 删除
      if (i > children2.length - 1) {
        result.push([REMOVE, children1[i]])
        continue
      }

      dfsDiff(children1[i], children2[i])
    }
  }

  dfsDiff(oldTree, newTree)

  return result
}
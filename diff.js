const REMOVE = 1
const PROPS = 2
const REPLACE = 3
const INSERT = 4
const TEXT = 5

/**
 * diff 两个VNode之间的差异并返回，不递归diff子节点
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

  // 认为事件绑定函数不会改变
  // 插入和修改prop
  Object.keys(newProps)
    .filter(prop => !prop.startsWith('on'))
    .forEach(key => {
      if (oldProps.hasOwnProperty(key)) {
        // 对于style特殊处理
        if (key === 'style') {
          const oldStyle = oldProps.style
          const newStyle = newProps.style
          const styleDiff = {}

          forOwn(newStyle, (key, value) => {
            if (oldStyle.hasOwnProperty(key)) {
              if (oldStyle[key] !== value) {
                styleDiff[key] = [REPLACE, value]
              }
            } else {
              styleDiff[key] = [INSERT, value]
            }
          })

          forOwn(oldStyle, (key, value) => {
            if (!newStyle.hasOwnProperty(key)) {
              styleDiff[key] = [REMOVE]
            }
          })
          
          if (!isEmptyObject(styleDiff)) {
            propsDiff.style = styleDiff
          }
        } else if(oldProps[key] !== newProps[key]) {
          propsDiff[key] = [REPLACE, newProps[key]]
        }
      } else {
        propsDiff[key] = [INSERT, newProps[key]]
      }
    })

  // 删除prop
  Object.keys(oldProps)
    .filter(prop => !prop.startsWith('on'))
    .forEach(key => {
      if (!newProps.hasOwnProperty(key)) {
        propsDiff[key] = [REMOVE]
      }
    })

  if (Object.keys(propsDiff).length === 0) return false

  return [2, propsDiff]
}

const diffTree = (oldTree, newTree) => {
  const result = []
  let path = 0

  // 同步dfs两个树，需要注意保持同步
  // 已经有过经验了，递归dfs快于手动堆栈
  const dfsDiff = (tree1, tree2) => {
    path++
    const rootPath = path
    const differenec = diffNode(tree1, tree2)
    if (differenec) result.push([path, ...differenec])

    const diffType = differenec[0]
    // 如果是替换或者文本节点，不用递归往下
    if ([REPLACE, TEXT].includes(diffType) || typeof tree1 === 'string') return

    const children1 = [...tree1.children]
    const children2 = [...tree2.children]
    const maxChildCount = Math.max(children1.length, children2.length)
    for(let i = 0; i < maxChildCount; i++) {
      // 插入
      if (i > children1.length - 1) {
        // 注意插入这里要使用父节点的path
        result.push([rootPath, INSERT, children2[i]])
        continue
      }
      // 删除
      if (i > children2.length - 1) {
        path++
        result.push([path, REMOVE, children1[i]])
        continue
      }

      dfsDiff(children1[i], children2[i])
    }
  }

  dfsDiff(oldTree, newTree)

  return result
}
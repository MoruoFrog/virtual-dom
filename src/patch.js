import diffType from './const'
import { forOwn } from './utils'
import WebDom from './webDom'

const {
  REMOVE,
  REPLACE,
  INSERT,
  TEXT,
  PROPS,
} = diffType

const patch = (difference = [], target) => {
  if (!target) {
    throw new Error('target is required')
  }
  if (!Array.isArray(difference)) throw new Error('difference must be array')
  
  let path = 0
  const actions = []

  const dfs = node => {
    path++
    const diff = difference.filter(([_path]) => path === _path).map(([p, action, modifier]) => [action, modifier])

    diff.forEach(([action, modifier]) => {
      switch (action) {
        case REMOVE:
          node.parentNode.removeChild(node)
          break

        case REPLACE:
          const newNode = WebDom.render(modifier)
          node.parentNode.replaceChild(newNode, node)
          break

        case TEXT:
          node.textContent = modifier
          break

        case PROPS:
          forOwn(modifier, (prop, propModifier) => {
            if (prop === 'style') {
              forOwn(propModifier, (key, ob) => {
                const [_action, value] = ob
                if (_action === REMOVE) node.style.removeProperty(key)
                if (_action === INSERT || _action === REPLACE) node.style[key] = value
              })
            } else {
              const [_action, value] = propModifier
              if (_action === REMOVE) node.removeAttribute(prop)
              if (_action === INSERT || _action === REPLACE) node.setAttribute(prop, value)
            }
          })
          break

        // 插入会影响后续的遍历，放入actions，遍历之后统一插入
        case INSERT:
          actions.push(() => node.appendChild(WebDom.render(modifier)))
          break
      }
    })

    // 插入，删除不用遍历子节点
    if (diff[0] && [REPLACE, REMOVE].includes(diff[0][0])) {
      return
    }

    // 这里一定要copy一份，否则会影响遍历的路径，因为可能会删除节点
    const childNodes = [...node.childNodes]
    for(let i = 0; i < childNodes.length; i++) {
      dfs(childNodes[i])
    }
  }

  dfs(target)
  actions.forEach(action => action())
}

export default patch
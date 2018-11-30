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
  let path = 0
  const actions = []

  const dfs = node => {
    path++
    const diff = difference.filter(([_path]) => path === _path).map(([p, action, modifier]) => [action, modifier])

    diff.forEach(([action, modifier]) => {
      if (action === REMOVE) {
        node.parentNode.removeChild(node)
      }

      if (action === REPLACE) {
        const newNode = WebDom.render(modifier)
        node.parentNode.replaceChild(newNode, node)
      }

      if (action === TEXT) {
        node.textContent = modifier
      }

      if (action === PROPS) {
        Object.keys(modifier).forEach(prop => {
          if (prop === 'style') {
            forOwn(modifier[prop], (key, ob) => {
              const [_action, value] = ob
              if (_action === REMOVE) node.style.removeProperty(key)
              if (_action === INSERT || _action === REPLACE) node.style[key] = value
            })
          } else {
            const [_action, value] = modifier[prop]
            if (_action === REMOVE) node.removeAttribute(prop)
            if (_action === INSERT || _action === REPLACE) node.setAttribute(prop, value)
          }
        })
      }

      // 插入会影响后续的遍历，放入actions，遍历之后统一插入
      if (action === INSERT) {
        actions.push(() => node.appendChild(WebDom.render(modifier)))
      }
    })

    // 插入，删除不用遍历子节点
    if (diff[0] && [REPLACE, REMOVE].includes(diff[0][0])) {
      return
    }
    node.childNodes.forEach(childNode => dfs(childNode))
  }

  dfs(target)
  actions.forEach(action => action())
}

export default patch
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
        return
      }

      if (action === REPLACE) {
        const newNode = WebDom.render(modifier)
        node.parentNode.replaceChild(newNode, node)
        return // 替换，删除后不需要遍历子节点
      }

      if (action === TEXT) {
        node.textContent = modifier
      }

      if (action === PROPS) {
        Object.keys(modifier).forEach(prop => {
          const [action, value] = modifier[prop]
          if (action === REMOVE) node.removeAttribute(prop)
          if (action === INSERT || action === REPLACE) node.setAttribute(prop, value)
        })
      }

      // 插入会影响后续的遍历，放入actions，遍历之后统一插入
      if (action === INSERT) {
        actions.push(() => node.appendChild(WebDom.render(modifier)))
      }
    })

    node.childNodes.forEach(childNode => dfs(childNode))
  }

  dfs(target)
  actions.forEach(action => action())
}
const forOwn = (obj, fn) => {
  Object.keys(obj).forEach(key => fn(key, obj[key]))
}

const isEmptyObject = obj => Object.keys(obj).length === 0

// 分离attributes和events
const groupProps = function(vNode) {
  const props = vNode.props
  const events = []
  const attributes = []

  Object.keys(props).forEach(key => {
    if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase()
      const eventHandler = props[key]

      if (events[eventName]) {
        events[eventName].push(eventHandler)
      } else {
        events[eventName] = [eventHandler]
      }
    } else {
      attributes[key] = props[key]
    }
  })

  return {
    events,
    attributes,
  }
}
import VNode from '../src/vNode.js'
import WebDom from '../src/webDom.js'
import diff from '../src/diff.js'
import patch from '../src/patch.js'

const handleClick = (e) => {
  console.log(e, 'clicked')
}

const li = (text, color) => new VNode(
  'li',
  { style: { color }, },
  [text]
)

const ul = new VNode(
  'ul',
  { onClick: handleClick, className: 'container' },
  [
    li('列表项1', 'blue'),
    li('列表项2', 'pink'),
    li('列表项3', 'blueviolet'),
  ]
)

WebDom.render(ul, document.getElementById('app'))

const ul2 = new VNode(
  'ul',
  { onClick: handleClick, className: 'container__' },
  [
    li('text', 'blue'),
    new VNode('div', {}, ['replace']),
    li('列表项3', 'red'),
    li('insert', 'red'),
  ]
)

const ul3 = new VNode(
  'ul',
  { onClick: handleClick, className: 'container__' },
  [
    li('text', 'blueviolet'),
    new VNode('div', {}, ['replace']),
  ]
)

const checkPatchInsert = () => {
  const patches = diff(ul, ul2)
  patch(patches, document.querySelector('.container'))
}

const checkPatchDelete = () => {
  const patches = diff(ul, ul3)
  patch(patches, document.querySelector('.container'))
}

const btnInsert = new VNode(
  'button',
  { onClick: checkPatchInsert },
  ['Insert'],
)

const btnRemove = new VNode(
  'button',
  { onClick: checkPatchDelete },
  ['Remove'],
)

const btnRecover = new VNode(
  'button',
  { onClick: () => WebDom.render(ul, document.getElementById('app')) },
  ['Recover'],
)

WebDom.render(btnInsert, document.getElementById('btnwrap'))
WebDom.render(btnRecover, document.getElementById('btnwrap'))
WebDom.render(btnRemove, document.getElementById('btnwrap'))
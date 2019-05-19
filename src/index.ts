class Component {
  state = {}
  props = {}

  constructor(props = {}) {
    this.props = props
  }

  setState(stateChange) {
    // 直接修改 state，然后重渲染
    Object.assign(this.state, stateChange)
    renderComponent(this)
  }
}

let React = {
  createElement(tag, attrs, ...children) {
    return {
      tag,
      attrs,
      children
    }
  },
  render,
  Component
}

// 渲染，将 vnode 挂载到某个实际 dom 上
function render(vnode, container) {
  container.innerHTML = ''
  return container.appendChild(_render(vnode))
}

// 渲染，将 vnode 翻译为内存中的 dom 节点
function _render(vnode) {
  // 如果 vnode 是字符串，说明是文本节点
  if(typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }

  // 如果 vnode 的 tag 是函数，说明是组件
  if(typeof vnode.tag === 'function') {
    const component = createComponent(vnode.tag, vnode.attrs)
    setComponentProps(component, vnode.attrs)
    return component.base
  }

  // 其他情况，根据 vnode tag 创建原生dom

  const node = document.createElement(vnode.tag)

  if(vnode.attrs) {
    for(let key in vnode.attrs) {
      setAttribute(node, key, vnode.attrs[key])
    }
  }

  if(vnode.children) {
    let frag = document.createDocumentFragment()
    vnode.children.forEach(n => {
      render(n, frag)
    })
    node.appendChild(frag)
  }

  return node
}

// 为 dom 添加 attributes
function setAttribute(dom, key, value) {
  if(key === 'className') {
    key = 'class'
  }
  if(key.startsWith('on')) {
    dom[key] = value
  }else {
    dom.setAttribute(key, value)
  }
}

// 创建组件实例，初始化 props
function createComponent(component, props) {
  let instance
  // 如果 component 就是一个类实例，直接实例化
  if(component.prototype && component.prototype.render) {
    instance = new component(props)
  }else {
    // 如果是函数组件，扩展其为类组件
    instance = new Component(props)
    instance.constructor = component
    instance.render = function() {
      return this.constructor.call(this, props)
    }
  }

  return instance
}

// component 用来更新 props，同时触发 componentWillMount 和 componentWillReceiveProps
function setComponentProps(componentIns, props) {

  if(!componentIns.base) {
    if(componentIns.componentWillMount) {
      componentIns.componentWillMount()
    }else if(componentIns.componentWillReceiveProps) {
      componentIns.componentWillReceiveProps()
    }
  }
  // 更新 props
  componentIns.props = props
  renderComponent(componentIns)
}

// 渲染/重渲染某个组件
// 此函数中实现 componentWillUpdate, componentDidUpdate, componentDidMount 方法
// 首次渲染，此时无 base 属性，触发componentDidMount
// 重渲染，有 base 属性，生成新的 base 随后通过访问 parentNode 进行替换
function renderComponent(componentIns) {
  let base

  if(componentIns.base && componentIns.componentWillUpdate) {
    componentIns.componentWillUpdate()
  }

  base = _render(componentIns.render())

  if(componentIns.base) {
    if(componentIns.componentDidUpdate) {
      componentIns.componentDidUpdate()
    }
  }else if(componentIns.componentDidMount) {
    componentIns.componentDidMount()
  }

  // 重渲染，更新dom
  if(componentIns.base && componentIns.base.parentNode) {
    componentIns.base.parentNode.replaceChild(base, componentIns.base)
  }

  // 用新的 dom 替换旧的 dom
  componentIns.base = base
  base._component = componentIns
}

export default React
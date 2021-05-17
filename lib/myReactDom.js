import MyReact from './myReact'

/**
 * 添加Dom中的属性
 */
 const setAttribute = (dom, attrs) => {
  for(let key in attrs) {
    // 添加对事件绑定的处理
    if (/^on/.test(key)) {
      dom[key.toLocaleLowerCase()] = attrs[key]
    } else if(key === 'style') {
      Object.assign(dom.style, attrs[key])
    } else {
      dom[key] = attrs[key]
    }
  }
}

 
const _render = (vnode, container) => {
  const dom = createDomfromVnode(vnode)
  container.appendChild(dom)
} 


/**
 * vnode转化为DOM方法
 **/
 const createDomfromVnode = (vnode) => {
  if(['string', 'number'].includes(typeof vnode)) {
    return document.createTextNode(vnode)
  }

  if(typeof vnode === 'object') {
    // 当vnode.tag是个函数时，代表这个时myReact组件
    if(typeof vnode.tag === 'function') {
      return createComponent(vnode.tag, vnode.attrs)
    }
    const dom = document.createElement(vnode.tag)
    setAttribute(dom, vnode.attrs)
    if (vnode.children && Array.isArray(vnode.children)) {
      vnode.children.forEach(vnodeChild => {
        _render(vnodeChild, dom)
      })
    }
    return dom
  }
}

/**
 * 实例化组件方法
 * @param {function} constructor: 组件的构造函数 
 * @param {object} attrs： 参数
 */
const createComponent = (constructor, attrs) => {
  let component
  if (constructor.prototype instanceof MyReact.Component) {
    component = new constructor(attrs)
  } else {
    // 实例化组件,使得组件具有state, props
    component = new MyReact.Component(attrs)
    component.constructor = constructor
    component.render = function() {
      return this.constructor(attrs)
    }
  }
  
  //调用组件的render方法，得到组件对应的vnode
  const vnode = component.render()
  // vnode转换成真实DOM
  const dom = createDomfromVnode(vnode)
  // 方便组件中拿到真实的DOM
  component.$root = dom
  return dom
}
/**
 * 渲染组件
 * @param {*} component 组件对象
 */
const renderComponent = (component) => {
  const vnode = component.render()
  const dom = createDomfromVnode(vnode)
  // 组件数据更新
  if (component.$root && component.$root.parentNode) {
    component.$root.parentNode.replaceChild(dom, component.$root)
  }
  component.$root = dom
  return dom
}

/**
 * 
 * MyReactDom root节点挂载方法
 */
const render = (vnode, container) => {
  container.innerHTML = ''
  _render(vnode, container)
}

export default {
  render,
  renderComponent,
}
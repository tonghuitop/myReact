import MyReact from './myReact'

/**
 * MyReactDom DOM挂载
 * @param {VNode} vnode
 * @param {HTMLElement} container
 */
function render(vnode, container) {
  const dom = createDomFromVnode(vnode)
  container.appendChild(dom)
}

/**
 * vnode转化为DOM方法
 **/
function createDomFromVnode(vnode) {

  if(!vnode) return

  if(['string', 'number'].includes(typeof vnode)) {
    return document.createTextNode(vnode)
  }
  if(Array.isArray(vnode)) {
    const fragment = document.createDocumentFragment()
    vnode.forEach(vnodeChild => {
      const dom = createDomFromVnode(vnodeChild)
      fragment.appendChild(dom)
    })
    return fragment
  }

  
  if(typeof vnode === 'object') {
    // 当vnode.tag是个函数时，代表这个时myReact组件
    if(typeof vnode.tag === 'function') {
      const component = createComponent(vnode.tag, vnode.attrs)
      renderComponent(component, true)
      return component.$root
    }
    const dom = document.createElement(vnode.tag)
    setAttribute(dom, vnode.attrs)
    if (vnode.children && Array.isArray(vnode.children)) {
      vnode.children.forEach(vnodeChild => {
        render(vnodeChild, dom)
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
function createComponent(constructor, attrs) {
  let component
  // 判断组件类型
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
  return component
}


/**
 * 添加Dom中的属性
 */
 function setAttribute(dom, attrs) {
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

/**
 * 渲染组件
 * @param {MyReact.Component} component 组件对象
 */
function renderComponent(component, isMount = false) {
  const vnode = component.render()
  const dom = isMount ? createDomFromVnode(vnode) : diffNode(component.$root, vnode)
  component.$root = dom
  component.$root._component = component
}

/**
 * vnode的diff算法
 * @param {HTMLElement} dom 
 * @param {VNode} vnode 
 * nodeType: 
 *   1 ---> 元素节点
 *   2 ---> 属性节点
 *   3 ---> 文本节点
 *   ...
 */
function diffNode(dom, vnode) {
  if(!vnode) {
    return removeDom(dom)
  }

  let patchedDom = dom
  // 如果是文本类型的虚拟DOM，要么替换内容，要么替换元素
  if (['string', 'number'].includes(typeof vnode)) {
    if (patchedDom.nodeType === 3 && patchedDom.textContent !== vnode) {
      patchedDom.textContent = vnode
    }
    return patchedDom
  }

  // 如果是组件，就调用diffComponent方法
  if (typeof vnode === 'object' && typeof vnode.tag === 'function') {
    patchedDom = diffComponent(dom, vnode)
    return patchedDom
  }

  // 如果存在但标签变了，就修正标签
  if (dom.nodeName.toLowerCase() !== vnode.tag.toLowerCase()) {
    patchedDom = document.createElement(vnode.tag)
    setAttribute(patchedDom, vnode.attrs)
    dom.childNodes.forEach((child) => patchedDom.appendChild(child))
    replaceDom(patchedDom, dom)
    return patchedDom
  }
  // diff attributes
  diffAttributes(patchedDom, vnode)
  // diff children
  diffChildren(patchedDom, vnode.children)

  return patchedDom
}


function diffComponent(dom, vnode) {
  let { _component:component = {} } = dom || {}
  if (component.constructor === vnode.tag) {
    setComponentProps(component, vnode.attrs)
  } else {
    component = createComponent(vnode.tag, vnode.attrs)
    setComponentProps(component, vnode.attrs, true)
  }
  return component.$root
}


function diffChildren(patchedDom, vChildren) {
  const domChildren = patchedDom.childNodes
  const domsHasKey = {}
  for (let dom of domChildren) {
    if (dom.key) {
      domsHasKey[dom.key] = dom
    }
  }

  // 用最长的做判断(dom, vdom)循环一次即可
  let vChild
  let patchChildDom
  let length = Math.max(domChildren.length, vChildren.length)

  for (let i = 0; i < length; i++) {
    vChild = vChildren[i]
    if(!vChild) {
      return removeDom(domChildren[i])
    }
    // 有key的处理逻辑
    if (vChild.key && domsHasKey[vChild.key]) {
      patchChildDom = diffNode(domsHasKey[vChild.key], vChild)
    } else {
    // 不带key的处理逻辑
      patchChildDom = diffNode(domChildren[i], vChild)
    }
    const { parentNode } = patchChildDom || {}
    if (parentNode !== patchedDom) {
      patchedDom.appendChild(patchChildDom)
    }
    setOrderInContainer(patchedDom, patchChildDom, i)
  }
}

/**
 * 属性diff方法
 * @param {HTMLElement} dom 
 * @param {VNode} vnode 
 */
function diffAttributes(dom, vnode) {
  const old = {}
  const attrs = vnode.attrs
  // 找到真实的dom的属性
  for (var i = 0; i < dom.attributes.length; i++) {
   const attrs = dom.attributes[i]
   old[attrs.name] = attrs.value
  }
  // 自己的属性不在新的属性里，把他删掉
  for (let key in old) {
    if(!(key in attrs)) {
      setAttribute(dom, key, undefined)
    }
  }
  // 重新遍历，设置为新的属性
  for (let key in attrs) {
    if(old[key] !== attrs[key]) {
      setAttribute(dom, key, attrs[key])
    }
  }
}

/**
 * 给组件添加属性
 * @param {Component} component 
 * @param {Object} props 
 */
function setComponentProps(component, props, isMount=false) {
  // 设置组件属性
  component.props = props
  // 渲染组件
  renderComponent(component, isMount)
}

/**
 * 删除DOM
 * @param {HTMLElement} dcom 
 */
function removeDom(dom) {
  if(dom && dom.parentNode) {
    dom.parentNode.removeChild(dom)
  }
}

/**
 * 替换DOM
 * @param {HTMLElement} newDom 
 * @param {HTMLElement} oldDom 
 */
function replaceDom(newDom, oldDom) {
  if(oldDom && oldDom.parentNode) {
    oldDom.parentNode.replaceChild(newDom, oldDom)
  }
}

/**
 * 对DOM的排序
 * @param {HTMLElement} container DOM容器
 * @param {HTMLElement} dom 
 * @param {Number} order 
 */
function setOrderInContainer(container, dom, order) {
  // 如果本身位置是对应的，就不走下面的逻辑了
  if(container.childNodes[order] !== dom) {
    container.childNodes[order].insertAdjacentElement('beforebegin', dom)
  }
}

export default {
  render,
  renderComponent,
}
import MyReactDom from './myReactDom'

const createElement = function (tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  }
}

class Component {
  constructor(props) {
    this.props= props
    this.state = {}

    renderComponent()
  }

  setState(state) {
    Object.assign(this.state, state)
    MyReactDom.renderComponent(this)
  }
}

/**
 * 将myReact组件渲染成真实的组件
 */
function renderComponent() {
  console.log('renderComponent')
}

const MyReact = {
  Component,
  createElement
}
export default MyReact
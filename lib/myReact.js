const createElement = function (tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  }
}

class Component {
  /**
   * 
   * @param {any} props 组件的入参 
   */
  constructor(props) {
    this.props= props
    this.state = {}

    renderComponent()
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
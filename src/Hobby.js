import MyReact from '../lib/myReact'


class Hobby extends MyReact.Component {
  defaultName = 'Hobby'
  constructor(props) {
    super(props)
    this.state = {
      hobbyIndex: 0,
      hobbys: ['打游戏', '看书', '跑步'],
    }
  }

  handleButton = () => {
    const { hobbyIndex } = this.state
    const newIndex = hobbyIndex === 2 ? 0 : hobbyIndex + 1
    this.setState({hobbyIndex: newIndex})
  }

  render () {
    const { hobbys, hobbyIndex } = this.state
    const hobby = hobbys[hobbyIndex] 
    return (
      <div>
        <p>我的爱好是{hobbys.toString()}</p>
        <p>今天玩{hobby}</p>
        <button className="btn" onClick={this.handleButton}>修改</button>
      </div>
    )
  }
}

export default Hobby
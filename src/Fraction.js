import MyReact from '../lib/myReact'

class Fraction extends MyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      fraction: 59,
    }
  }

  handleComeOn = () => {
    const { onComeOn } = this.props
    const { fraction: olFraction } = this.state
    this.setState({ fraction: olFraction + 1 })
    onComeOn()
  }

  render() {
    const { fraction } = this.state
    return (
      <div>
        <h1>小辉的物理考了{fraction}分</h1>
        <button onClick={this.handleComeOn}>加加油</button>
      </div>
    ) 
  }
}

export default Fraction
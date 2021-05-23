import MyReact from '../lib/myReact'
import MyReactDom from '../lib/myReactDom'
import Fraction from './Fraction'
import Job from './Job'
import Hobby from './Hobby'

class App extends MyReact.Component {
  defaultName = 'App'
  constructor(props) {
    super(props)
    this.state = {
      name: 'tonghui',
      job: '前端工程师',
      teamPerformance: 89,
      isShowFraction: true,
    }
  }

  handleShowFraction = () => {
    const { isShowFraction } = this.state
    this.setState({isShowFraction: !isShowFraction})
  }

  onComeOn = () => {
    const { teamPerformance } = this.state
    this.setState({teamPerformance: teamPerformance + 1})
  }

  render() {
    const { name, job, teamPerformance, isShowFraction } = this.state
    return (
      <div className="wrapper">
        {isShowFraction && <Fraction onComeOn={this.onComeOn} />}
        <button onClick={this.handleShowFraction}>显示物理分数</button>
        <h1>小辉的团队得{teamPerformance}分</h1>
        <h1>hello {name}</h1>        
        <Job job={job} />
        <Hobby />
      </div>
    )
  }
}


MyReactDom.render(<App />, document.querySelector('#app'))
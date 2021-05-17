import MyReact from '../lib/myReact'
import MyReactDom from '../lib/myReactDom'
import Fraction from './Fraction'
import Job from './Job'
import Hobby from './Hobby'

class App extends MyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'tonghui',
      job: '前端工程师',
      teamPerformance: 89,
    }
  }

  onComeOn = () => {
    const { teamPerformance } = this.state
    this.setState({teamPerformance: teamPerformance + 1})
  }

  render() {
    const { name, job, teamPerformance } = this.state
    return (
      <div className="wrapper">
        <Fraction onComeOn={this.onComeOn} />
        <h1>小辉的团队得分{teamPerformance}</h1>
        <h1>hello {name}</h1>        
        <Job job={job} />
        <Hobby />
      </div>
    )
  }
}


MyReactDom.render(<App />, document.querySelector('#app'))
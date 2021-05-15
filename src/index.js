import MyReact from '../lib/myReact'
import MyReactDom from '../lib/myReactDom'

// const name = "tonghui"
// const email = "tonghui.wu@outlook.com"
// const handleBtn = () => {
//   console.log('handle button')
// }
// const element = (
//   <div className="wrapper">
//     <h1 className="title">hello {name} email: {email}</h1>
//     <button className="s-btn" onClick={handleBtn}>button</button>
//   </div>
// )

// MyReactDom.render(element, document.querySelector('#app'))

// let num = 0
// let timer = null
// let styleObj = {
//   color: 'red',
//   fontSize: '20px'
// }

// const onStart = () => {
//   timer = setInterval(() => {
//     num = num + 1
//     const temp = (
//       <div className="wrapper">
//         <h1 style={styleObj}>Number: {num}</h1>
//         <button onClick={onStart}>start</button>
//         <button onClick={onPause}>pause</button>
//       </div>
//     )
//     MyReactDom.render(temp, document.querySelector('#app'))
//   }, 2000)
// }

// /**
//  * 清楚定时器
//  */
// const onPause = () => {
//   clearInterval(timer)
// }
// onStart()


class App extends MyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'tonghui',
      job: '前端工程师',
      hobby: '打游戏',
    }
  }

  render() {
    const { name, job, hobby } = this.state
    return (
      <div className="wrapper">
        <h1>hello {name}</h1>
        <Job job={job} />
        <Hobby hobby={hobby} />
      </div>
    )
  }
}

const Hobby = (props) => {
  const { hobby } = props || {}
  return (
    <p>我的爱好是{hobby}</p>
  )
}
class Job extends MyReact.Component {
  render() {
    const { job } = this.props
    return (
      <div className="job">我的工作是{job}</div>
    )
  }
}

MyReactDom.render(<App />, document.querySelector('#app'))
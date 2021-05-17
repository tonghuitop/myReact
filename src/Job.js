import MyReact from '../lib/myReact'

const Job = (props) => {
  const { job } = props
  return (
    <div className="job">我的工作是{job}</div>
  )
}

export default Job
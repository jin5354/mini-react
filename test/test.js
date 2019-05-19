import React from '../src/index'

const $app = document.getElementById('app')

// 测试函数组件
function Welcome(props) {
  return <h1>Hello, {props.name} from function component</h1>
}

// 测试类组件
class Hello extends React.Component {
  render() {
    return <h1>Hello, {this.props.name} from class component</h1>
  }
}

// 测试计数器组件

class Counter extends React.Component {
  state = {
    count: 0
  }

  onClick() {
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return <h1 onclick={this.onClick.bind(this)}>Hello, {this.props.name} counter, {`${this.state.count}`}</h1>
  }
}

const element = (
  <div className="123">
      <p>It is {new Date().toLocaleTimeString()}</p>
      <Welcome name="world-funciton"></Welcome>
      <Welcome name="world-funciton2"></Welcome>
      <Hello name="world-class"></Hello>
      <Hello name="world-class2"></Hello>
      <Counter name="from-prop-name"></Counter>
  </div>
)

console.log(element)

React.render(
  element,
  $app
)
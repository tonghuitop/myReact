const myReact = {}
myReact.createElement = function () {
  console.log(arguments)
}
let element = <div>hello world</div>
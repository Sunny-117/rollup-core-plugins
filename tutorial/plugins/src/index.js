import { msg } from './msg.js'
// console.log('abc', msg)

// import '\0polyfill'
// import './polyfill'
// console.log('main')

const getName = () => {
  return msg
}

console.log(getName())

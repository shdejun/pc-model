//moduleA 的请求api
import moduleA from './src/moduleA'
//moduleB 的请求api
import moduleb from './src/moduleB'

export default {
  ...moduleA,
  ...moduleb
}
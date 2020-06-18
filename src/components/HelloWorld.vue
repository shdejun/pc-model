<template>
  <div class="hello">
    <h2>test babel</h2>
    <p>test @babel/rutime 和 @babel/plugin-transform-runtime(是否支持dom不兼容的api,promise,set,array.from,asynv...)<button @click="testNoDomApi">test</button></p>
    <p>test @babel/plugin-transform-proposal-class-properties class类 貌似不用装。。。<button @click="testClass">testClass</button></p>
    <p>test @babel/plugin-transform-proposal-decorators 装饰器<button @click="testDecorators">testDecorators</button></p>
    <p>test @babel/plugin-proposal-json-strings <button @click="testJosnString">testJosnString</button></p>
    <p>test @babel/plugin-proposal-export-namespace-from like(export * as ns from 'mod') </p>
    <p>test @babel/plugin-proposal-throw-expressions  <button @click="expressions">expressions</button> </p>
    <p>test @babel/plugin-proposal-logical-assignment-operators  a ||= b;obj.a.b ||= c;特殊语法解析 <button @click="assignment">assignment</button> </p>
    <p>
      babel-plugin-syntax-jsx
      babel-plugin-transform-vue-jsx
      babel-helper-vue-jsx-merge-props
      综合使用 可以在项目中使用JSX语法
    </p>
    <h2>test postcss</h2>
    <p class="postcss-import">postcss-import11111111</p>
  </div>
</template>

<script>
import * as namespace from './test';
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    //测试非DOM api
    testNoDomApi(){
      let pr = new Promise((resolve,reject) => {
        // reslove('hah')
      });
      let obj = {}
      Object.assign({},{a:2})
      return
      if(st){
        alert('ok')
      }else{
        throw new Error("参数必须是数字"); 
      }
    },
    //测试类class
    testClass(){
     class leiclass {
       constructor(){}
       aa(){
         return 'class'
       }
      }
      const aa = new leiclass()
      console.log(aa.aa())
    },
    //测试装饰器
    testDecorators(){
      @isTestable(true)
      class MyClass { }
      function isTestable(value) {
        return function decorator(target) {
          target.isTestable = value;
        }
      }
      isTestable(11)
      console.log(new MyClass())
    },
    //测试
    testJosnString(){
      // const str ='[
      //   {"fieldName":"create_time","compareSymbol":"LESS_THAN","param":"2020/6/13"},
      // {"fieldName":"biz_Status","compareSymbol":"EQUALS","param":"ORDER_ACCEPTED"},
      // {"fieldName":"plate_Number","compareSymbol":"LIKE","param":"%11%"},
      // {"fieldName":"customer_mobile","compareSymbol":"LIKE","param":"%1水水%"},{"fieldName":"admin_remark","compareSymbol":"LIKE","param":"%11%"},{"fieldName":"district","compareSymbol":"LIKE","param":"%岳麓区%"},{"compareSymbol":"DESC","fieldName":"create_time","param":"DESC"}]'
    },
    expressions(){
      // function test(param = throw new Error('required!')) {
      //     const test = param === true || throw new Error('Falsy!')
      // }
    },
    //特殊语法解析
    assignment(){
      // a ||= b;
      // obj.a.b ||= c;
    }
  }
}
</script>


<style lang="scss">
  @import './csstest.scss';

</style>

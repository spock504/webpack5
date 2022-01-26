import './main.css'
import '@/sass.scss' // 引入 Sass 文件
import './font/iconfont.css' // 字体样式
import $ from 'jquery'; // externals 抽离模块测试
import moment from "moment"; // IgnorePlugin: 阻止生成模块import或调用：require
import { cube } from './math.js';
import test from './public/test.png'



$('.iconfont').animate({
  fontSize: 100
});

console.log('moment()',moment().format('YYYY-MM-DD'));


const a = 'Hello ITEM'
// console.log(a)

const list = [
  "a", "b", "c"
]

const mapList = list.map((item) => item + "1")
class Author {
  name = 'ITEM'
  age = 18
  email = 'lxp_work@163.com'

  info = () => {
    return {
      name: this.name,
      age: this.age,
      email: this.email
    }
  }
}
const au = new Author()
console.log('mapList', mapList, au);

// 新增装饰器的使用
@log('hi')
class MyClass { }

function log(text) {
  return function (target) {
    target.prototype.logger = () => `${text}，${target.name}`
  }
}


const img = new Image()
img.src = test
document.getElementById('imgBox').appendChild(img)


// 按需加载
// img.addEventListener('click', () => {
//   import('./desc').then(({ default: element }) => {
//     console.log(element)
//     document.body.appendChild(element)
//   })
// })

// prefetch (预获取)
img.addEventListener('click', () => {
  import( /* webpackPrefetch: true */ './desc').then(({ default: element }) => {
    console.log(element)
    document.body.appendChild(element)
  })
})


// Tree Shaking 测试
function component() {
  const element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = [
    'Hello webpack!',
    '5 cubed is equal to ' + cube(5)
  ].join('\n\n');

   return element;
 }

 document.body.appendChild(component());
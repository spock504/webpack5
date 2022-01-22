import './main.css'
import './sass.scss' // 引入 Sass 文件
import './font/iconfont.css' // 字体样式

import test from '../public/test.png'

const a = 'Hello ITEM'
console.log(a)

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
  return function(target) {
    target.prototype.logger = () => `${text}，${target.name}`
  }
}


const img = new Image()
img.src = test
document.getElementById('imgBox').appendChild(img)
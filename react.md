## React
### create-react-app
创建react项目：
```
npx create-react-app reace-demo
```  
创建支持`typeScript`的react项目：
```
npx create-react-app my-react-ts --template typescript
```
### tsconfig解读
> 官方文档：https://www.typescriptlang.org/zh/tsconfig
#### compilerOptions
+ `noImplicitAny`：代表是否将`ts`从可选类型语言改成强制性类型语言，默认`true`，如果我们修改成`false`了，就能在一个项目里同时应用`ts`和`js`（其实就是将一些没有写明类型的变量默认更改成了`any`类型）
+ `target`：代表要编译后的JS版本，一般是`ES5`，因为浏览器只支持到`ES5`
+ `lib`：编译期间所有包括进来的库文件，通过这些库文件，告诉ts编译器，哪些API可以使用
+ `allowJs`：开启这个选项，能够允许我们混合编译JS和TS文件  
+ `esModuleInterop`：开启这个选项能允许我们使用commonJS的方式 Import 默认文件
+ `module`：代码的模块系统，有`commonJS(CJS)`、`esnext(ESM)`、`AMD`等  
+ `moduleResolution`：默认为`node`，另一个被废弃了，代表的是编译器的工作方式  
+ `resolveJsonModule`: true，搭配`moduleResolution`就能实现 解析json了
+ `isolatedModules`：编译器会将每个文件当成单独的模块来使用  
+ `noEmit`：当发生错误时，编译器不生成JS代码  
+ `jsx`：允许编译器支持的框架代码，值可能为`react-jsx`---改为 __jsx 调用并生成 .js 文件；react---将 JSX 改为等价的对 React.createElement 的调用并生成 .js 文件；preserve---不对 JSX 进行改变并生成 .jsx 文件
+ `plugins`：使用ts相关的插件比如支持`css-module`语法的`typescript-plugin-css-modules`
#### include
代表告诉ts编译器要编译那个文件夹下面的文件
#### eninclude
告诉ts编译器哪个文件下的文件不需要编译
### ts编译流程
block住了。。。大概的流程就是，读取tsconfig.js，然后根据配置去编译，底层使用的loader是`babel-loader`
### jsx语法
#### js,jsx,ts,tsx区别
+ js：使用原生的js语法
+ jsx：使用jsx语法
+ ts：使用原生的js语法，且使用ts
+ tsx：使用jsx语法，且使用ts
#### 最佳实践
当我们使用了原生的js那么就使用`.js`作为文件后缀，当我们使用`jsx`语法的时候，就是用`.jsx`作为后缀；当使用了`ts`时，就按照`ts`和`tsx`来用。  
#### jsx本质
底层是调用了`React.createElment`
#### jsx安全
jsx中react帮助我们防止了`XSS`攻击（把输入jsx中的变量做了一层转换，转换成安全的字符串），这点跟Vue的很类似，Vue的是在模板解析的时候就转换了  
就算是react帮我们过滤掉了一部分的XSS，但是还是存在着XSS攻击的风险，比如传入一个函数，那么可以触发XSS攻击
```
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const xss = "javascript:alert('Hacked');"
  return (
    <div className="App">
      <a href={xss}>点击</a>
    </div>
  );
}

export default App;
```
运行上面的代码点击a连接，可以发现我们仍然是被XSS攻击了
#### jsx自定义属性
使用`data-`为前缀的定义自定义属性
```
const el = <div data-indexOff={1}></div>
```
### CSS样式引入
CSS样式引入有两种方式：
#### 单纯引入
组件：roboot.tsx下
```
import React from "react";
import "./roboot.css"
interface RobootProp {   // 定义props 的接口 类型 ts在这里就能帮助我们检查代码中的错误了
    id:number,
    name:string,
    email:string
}
//   React.FC<RobootProp>  代表 这个Roboot 是一个React.FC 类型的函数，即 函数式 组件 参数 props 类型为 RobootProp
const Roboot:React.FC<RobootProp> =({id,name,email})=>{
    return (
        <>
            <li>
                <img src={`https://robohash.org/${id}`} alt="rooboot Img" />
            </li>
            <li>emila:{email}</li>
        </>
    )
}
export default Roboot;
```
roboot.css
```
li{
    font-size: 12px;
}
```
app.css
```
li{
    font-size: 30px;
}
```
APP.tsx
```
import React from 'react';
import logo from './logo.svg';
import './App.css';
import robootData from "./mockData/roboot.json"
import Roboot from "./components/roboot"
import Test from "./components/test"

function App() {
  return (
    <div>
      <Test></Test>
    <div className="App">
      <ul >
        {
          robootData.map(i=>
            <Roboot id={i.id} name={i.name} email={i.email}>

            </Roboot>
            )
        }
      </ul>
    </div>
    </div>
  );
}

export default App;

```
使用`import`为组件注入样式，如果我们在根组件`APP.tsx`中引入了`app.css`那么，`roboot.css`的样式优先级将比`app.css`中要高。  
此时我们新建一个`test.tsx`文件
```
import React from "react"

const Test:React.FC = ()=>{
    return (
        <>
        <li>ddddddd</li>
        </>
    )
}
export default Test
```
此时我们发现`test.tsx`中的样式竟然还是`roboot.css`中的样式，这就是CSS样式的`全局污染`  
于是我们就有了第二种方法
#### css Module
首先我们要知道react的思想：  
1. 每个jsx或者 tsx 文件都应该被视为一个独立的原件
2. 原件内包含的内容也是独立的
根据这两条法则，我们可以知道，每个组件内对应的css样式应当只针对当前的组件起作用  
那么如何实现呢？很简单：  
`我们只需要将css做成一个对象，在这个对应的组件内，使用对象的方法就行了，这就是CSS-Module`  
原来的引用
```
import "./roboot.css"
```
使用`CSS-Module`
```
import style from "./roboot.csss"
<div className={style.li}></div>
```  
首先我们先将`app.css`更改成遵循`CSS-Module`规范的名称`app.module.css`  
app.module.css
```
.app {
  text-align: center;
}

.appHeader {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 36px;
  margin-bottom: 24px;
}

.appLogo {
  height: 10vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .appLogo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.robotList {
	width: 85vw;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-gap: 20px;
}
```
接着创建TS的文件类型声明 
##### TS文件类型声明
1. 只包含类型声明，无任何逻辑
2. 不参与webpack打包，不参与编译
3. 作用是帮助ts识别特殊文件
4. 基本语法：*.d.ts
在`src`创建`custom.d.ts`
```
declare module "*.css" {  // 针对 *.css 进行一个声明
    const css : {[key:string]:string}   // 将所有 *.css 包装成一个对象
    export default css
}
```  
在`APP.tsx`中我们就可以使用对象的变量的形式使用css了
```
import React from 'react';
import style from './App.module.css';
import robootData from "./mockData/roboot.json"
import Roboot from "./components/roboot"

function App() {
  return (
    <div className={style.app}>
      <div className={style.robotList}>
        {
          robootData.map(i=>
            <Roboot id={i.id} name={i.name} email={i.email}>

            </Roboot>
            )
        }
      </div>
    </div>
  );
}

export default App;
```
##### CSS-Module如何实现？
其实就是一个`css in js`的技术，就是使用js动态注入css。
##### ts的css-module更好的支持
为了实现使用ts对`css-module`进行类型支持，我们可以这么做：
1. 安装`typescript-plugin-css-modules`
```
npm i typescript-plugin-css-modules -D   // 安装到开发环境
```
2. 在`tsconfig.json`中添加
```
{
    "compilerOptions":{
        "plugins": [
        {
            "name": "typescript-plugin-css-modules"
        }
        ]
    }
}
```
3. 在根目录新建`.vscode/settings.json`
这一步是为了，让vscode编辑器和ts发挥出自己的特色，实现智能输入
```
{
	"typescript.tsdk": "node_modules/typescript/lib",
	"typescript.enablePromptUseWorkspaceTsdk": true
}
```



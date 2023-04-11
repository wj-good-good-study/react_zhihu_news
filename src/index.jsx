//程序打包入口
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// REDUX
import { Provider } from 'react-redux';
import store from './store';

//ANTD-MOBILE语言包
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';

//导入REM响应式布局插件
import 'lib-flexible';
import './index.less';

//设置页面最大宽度和字体
(function () {
    const handleMax = function handleMax() {
        let html = document.documentElement,
            root = document.getElementById('root'),
            deviceW = html.clientWidth
        root.style.maxWidth = '750px'
        if (deviceW >= 750) {
            html.style.fontSize = '75px'
        }
    };
    handleMax();
    // window.addEventListener('resize',handleMax) 
})();

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <ConfigProvider local={zhCN}>
        <Provider store={store}>
            <App />
        </Provider>
    </ConfigProvider>
);
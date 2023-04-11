import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom'
import { Mask, DotLoading, Toast } from "antd-mobile";
import routers from "./routes";
import store from "../store";
import actions from "../store/actions";

const isCheckLogin = (path) => {
    let { base: { info } } = store.getState(),
        checkList = ['/personal', '/store', '/update'];
    return !info && checkList.includes(path);
}

const Element = function Element(props) {
    let { component: Component, meta, path } = props;
    let isShow = !isCheckLogin(path);
    let [_, setRandom] = useState(0);
    // 登录态校验
    useEffect(() => {
        if (isShow) return;
        // 如果info不存在，跳转的地址是三个中的一个，从服务器获取登录者信息
        (async () => {
            let infoAction = await actions.base.queryUserInfoAsync();
            let info = infoAction.info;
            if (!info) {
                // 获取后还是不存在：没有登陆
                Toast.show({
                    icon: 'fail',
                    content: '请先登录'
                })
                // 跳转到登录页
                navigate({
                    pathname: '/login',
                    search: `?to=${path}`
                }, { replace: true })
                return;
            }
            // 获取了信息,说明是登陆状态，派发任务把信息存储到容器中
            store.dispatch(infoAction);
            setRandom(+new Date());
        })();
    });

    //修改页面的TITLE
    let { title = "知乎日报-WebApp" } = meta || {};
    document.title = title;
    //获取路由信息,基于属性传递给组件
    const navigate = useNavigate(),
        location = useLocation(),
        params = useParams(),
        [usp] = useSearchParams();

    return (
        <>
            {
                isShow ? <Component
                    navigate={navigate}
                    location={location}
                    params={params}
                    usp={usp} /> :
                    <Mask visible={true}>
                        <DotLoading color="white" />
                    </Mask>
            }
        </>
    )
};

export default function RouterView() {
    return (
        <Suspense fallback={<Mask visible={true}><DotLoading color="white" /></Mask>}>
            <Routes>
                {routers.map(item => {
                    let { name, path } = item;
                    return <Route key={name} path={path} element={<Element {...item} />} />;
                })}
            </Routes>
        </Suspense>
    )
};
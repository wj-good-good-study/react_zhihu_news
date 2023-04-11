import React, { useState, useEffect, useMemo } from "react";
import { LeftOutline, MessageOutline, LikeOutline, StarOutline, MoreOutline } from 'antd-mobile-icons';
import { Badge, Toast } from "antd-mobile";
import api from "../api";
import SkeletonAgain from "../components/SkeletonAgain";
import { flushSync } from "react-dom";
import { connect } from "react-redux";
import actions from "../store/actions";
import styled from "styled-components";

const DetailBox = styled.div`
    .content {
        overflow-x: hidden;
        margin: 0;
        padding-bottom: 90px;

        .img-place-holder {
            overflow: hidden;

            img {
                margin: 0;
                width: 100%;
            }
        }

        // 修改知乎错误的样式
        .meta {
            .avatar {
                display: inline-block;
                margin-top: 0;
                margin-bottom: 0;
            }
        }

    }

    .tab-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 999;
        box-sizing: border-box;
        width: 100%;
        background-color: #ddd;
        height: 90px;
        display: flex;
        align-items: center;



        .back {
            height: 50px;
            width: 100px;
            font-size: 40px;
            font-weight: 900;
            text-align: center;
            line-height: 50px;
            border-right: 2px solid #aaa;
        }

        .icons {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 50px;
            line-height: 50px;

            .adm-badge-wrapper,
            span {
                flex-grow: 1;
                text-align: center;
                font-size: 40px;
            }

            span {
                &:last-of-type(1) {
                    color: #aaa;
                }

                &:nth-of-type(1) {
                    &.stored {
                        color: #108ee9;
                    }
                }
            }

            .adm-badge-wrapper {
                .adm-badge-fixed {
                    right: 30%;

                }

                .adm-badge {
                    background: none;

                    .adm-badge-content {
                        color: #555;
                    }
                }
            }

        }
    }
`;

const Detail = function Detail(props) {
    let { navigate, params } = props;
    // ============新闻状态
    let [info, setInfo] = useState(null),
        [extra, setExtra] = useState(null);
    // 第一次渲染完毕获取数据
    // 样式
    let link; // 便于销毁组件
    const handleStyle = (result) => {
        let { css } = result;
        if (!Array.isArray(css)) return;
        css = css[0];
        link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = css;
        document.head.appendChild(link);
    };
    // 处理图片
    const handleImage = (result) => {
        // 不处理异步，则在此处无法获得该元素
        let imgPlaceholder = document.querySelector('.img-place-holder');
        if (!imgPlaceholder) return;
        // 创建大图
        let tempImg = new Image;
        tempImg.src = result.image;
        // 加载成功就添加到大图下
        tempImg.onload = () => {
            imgPlaceholder.appendChild(tempImg);
        };
        // 出错就移除headline
        tempImg.onerror = () => {
            let parent = imgPlaceholder.parentNode;
            parent.parentNode.removeChild(parent);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                let result = await api.queryNewsInfo(params.id);
                flushSync(() => {//优先渲染函数体内的,或者使用的注释一的方法
                    setInfo(result);
                    handleStyle(result);
                });
                handleImage(result);
            } catch (error) {
                console.log(error);
            }
        })();
        return () => {
            if (link) document.head.removeChild(link);
        }
    }, []);

    useEffect(() => {
        (async () => {
            try {
                let result = await api.queryStoryExtra(params.id);
                setExtra(result);
                handleStyle(result);
                handleImage(result);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);
    // 注释一：添加数据依赖，在extra修改后在执行函数操作，因为钩子函数修改状态是异步操作
    // useEffect(() => {
    //     handleStyle(extra);
    //     handleImage(extra);
    // }, [extra]);

    // ==============下面为登录和收藏
    let {
        base: { info: userInfo }, queryUserInfoAsync,
        location,
        store: { list: storeList }, queryStoreListAsync, removeStoreListById
    } = props;
    useEffect(() => {
        (async () => {
            // 第一次渲染完，如果userInfo不存在，需要派发任务同步登陆者信息
            if (!userInfo) {
                let { info } = await queryUserInfoAsync();
                userInfo = info;
            }
            // 已经登录 && 没有收藏列表
            if (userInfo && !storeList) {
                queryStoreListAsync();
            }
        })();
    }, []);
    // 依赖于收藏列表和路径参数计算出是否收藏
    const isStore = useMemo(() => {
        if (!storeList) return false;
        return storeList.some(item => {
            return +item.news.id === +params.id;
        });
    }, [storeList, params])

    // 点击收藏按钮
    const handleStore = async () => {
        // 没登陆进到登录页
        if (!userInfo) {
            Toast.show({
                icon: 'fail',
                content: '请先登录'
            });
            navigate(`/login?to=${location.pathname}`, { replace: true });
            return;
        }
        // 已经登录进行收藏和移除收藏
        if (isStore) {
            // 移除收藏
            let item = storeList.find(item => {
                return +item.news.id === +params.id;
            });
            if (!item) return;
            let { code } = await api.storeRemove(item.id);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '操作失败'
                });
                return;
            }
            Toast.show({
                icon: 'success',
                content: '操作成功'
            });
            removeStoreListById(item.id);
            return;
        }
        try {
            let { code } = await api.store(params.id);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '收藏失败'
                });
                return;
            }
            Toast.show({
                icon: 'success',
                content: '收藏成功'
            });
            // 同步最新的收藏列表到redux中
            queryStoreListAsync();
        } catch (error) { }
    }

    return (
        <DetailBox>
            {/* 新闻内容 */}
            {
                !info ? <SkeletonAgain /> :
                    <div className="content" dangerouslySetInnerHTML={{ __html: info.body }}></div>
            }
            {/* 底部图标 */}
            <div className="tab-bar">
                <div className="back" onClick={() => { navigate(-1); }}>
                    <LeftOutline />
                </div>
                <div className="icons">
                    <Badge content={extra ? extra.comments : 0}><MessageOutline /></Badge>
                    <Badge content={extra ? extra.popularity : 0}><LikeOutline /></Badge>
                    <span className={isStore ? 'stored' : ''}
                        onClick={handleStore}><StarOutline /></span>
                    <span><MoreOutline /></span>
                </div>
            </div>
        </DetailBox>
    )
};
export default connect(
    state => {
        return {
            base: state.base,
            store: state.store
        }
    },
    { ...actions.base, ...actions.store }
)(Detail);
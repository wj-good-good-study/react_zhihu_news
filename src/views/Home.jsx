import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, Image, Divider, DotLoading } from "antd-mobile";
import HomeHead from "../components/HomeHead";
import NewsItem from "../components/NewsItem";
import SkeletonAgain from '../components/SkeletonAgain'
import _ from '../assets/utils';
import api from '../api';
import styled from "styled-components";

const HomeBox = styled.div`
    .swiper-box {
        box-sizing: border-box;
        width: 100%;
        background-color: #ddd;

        .adm-swiper {
            height: 100%;
        }

        a {
            display: block;
            height: 100%;
        }

        .adm-image,
        img {
            display: block;
            width: 100%;
            height: 100%;

            .adm-image-tip {
                svg {
                    height: 30%;
                    width: 30%;
                }
            }
        }

        .desc {
            position: absolute;
            box-sizing: border-box;
            width: 100%;
            left: 0;
            bottom: 40px;
            padding: 0 30px;

            .title {
                font-size: 36px;
                color: #fff;
            }

            .author {
                font-size: 24px;
                color: rgba(255, 255, 255, .7);
                line-height: 60px;
            }
        }

        .adm-swiper-indicator {
            bottom: 20px;
            left: auto;
            right: 0;
            transform: translateX(-30px);
        }

        .adm-page-indicator-dot {
            margin: 0 6px;
            width: 12px;
            height: 12px;
            background-color: rgba(255, 255, 255, .7);
            border-radius: 6px;

            &.adm-page-indicator-dot-active {
                width: 36px;
                background-color: #fff;
            }
        }


    }

    .news-box {
        padding: 10px 30px;

        .adm-divider-left {
            &.adm-divider-horizontal {
                &:before {
                    max-width: 2%;
                }
            }
        }

    }

    .loadmore-box {
        background-color: #eee;
        text-align: center;
        height: 80px;
        line-height: 80px;
        font-size: 24px;
        color: #999;

        .adm-dot-loading {
            position: static;
            transform: none;
            font-size: 32px;
        }
    }
`;

const Home = function Home() {
    // 创建需要的状态
    let [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}")),
        [bannerData, setBannerData] = useState([]),
        [newsList, setNewsList] = useState([]);
    // 第一次渲染完毕之后：向服务器发送请求
    useEffect(() => {
        (async () => {
            try {
                let { date, stories, top_stories } = await api.queryNewsLatest();
                setToday(date);
                setBannerData(top_stories);
                // 更新新闻列表信息，useState有自己的优化机制，需要使用拓展运算符展开传值
                newsList.push({
                    date,
                    stories
                });
                setNewsList([...newsList]);
            } catch (error) {
                console.log(error)
            }
        })();
    }, []);
    // 第一次渲染，设置监听器实现触底加载
    let loadMore = useRef();
    useEffect(() => {
        // 使用监听器判断加载更多是否出现在窗口中
        let ob = new IntersectionObserver(async changes => {
            let { isIntersecting } = changes[0]
            if (isIntersecting) {
                // 加载更多按钮出现在视口中
                let time = newsList[newsList.length - 1]['date'];
                try {
                    let res = await api.queryNewsBefore(time);
                    newsList.push(res);
                    setNewsList([...newsList]);
                } catch (error) {
                    console.log(error);
                }
            }
        });
        // 在组件释放时已经没有loadMore.current，在销毁时会报错，故使用变量保存
        let loadMoreBox = loadMore.current;
        ob.observe(loadMoreBox);

        // 在组建销毁时销毁监听器
        return () => {
            ob.unobserve(loadMoreBox);
            ob = null;
        }
    }, []);
    return (
        <HomeBox>
            {/* 头部 */}
            <HomeHead today={today} />
            {/* 轮播图 */}
            <div className="swiper-box">
                {bannerData.length > 0 ?
                    <Swiper autoplay={true} loop={true}>
                        {
                            bannerData.map(item => {
                                let { id, title, hint, image } = item;
                                return (
                                    <Swiper.Item key={id}>
                                        <Link to={{
                                            pathname: `/detail/${id}`
                                        }}>
                                            <Image lazy src={image} />
                                            <div className="desc">
                                                <h3 className="title">{title}</h3>
                                                <p className="author">{hint}</p>
                                            </div>
                                        </Link>
                                    </Swiper.Item>
                                )
                            })
                        }
                    </Swiper>
                    : null}
            </div>
            {/* 新闻列表 */}
            {
                newsList.length === 0 ?
                    <SkeletonAgain /> :
                    <>
                        {
                            newsList.map((item, index) => {
                                const { date, stories } = item;
                                return (
                                    <div className="news-box" key={date}>
                                        {
                                            index !== 0 ?
                                                <Divider contentPosition="left">{_.formatTime(date, '{1}月{2}日')}</Divider> :
                                                null
                                        }
                                        <div className="news-list">
                                            {
                                                stories.map(story => {
                                                    return (
                                                        <NewsItem key={story.id} info={story} />
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>
                                )
                            })
                        }
                    </>
            }
            {/* 加载更多 */}
            <div className="loadmore-box" style={{ display: newsList.length === 0 ? 'none' : 'block' }} ref={loadMore}>
                <DotLoading />数据加载中
            </div>
        </HomeBox>
    )
};
export default Home; 
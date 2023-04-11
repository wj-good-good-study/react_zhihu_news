import React, { useMemo, useEffect } from 'react';
import head_jpg from '../assets/images/h1.jpg';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../store/actions';
import styled from 'styled-components';

const HomeHeadBox = styled.div`
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;

    .info {
        display: flex;
        align-items: center;

        .title {
            height: 64px;
            line-height: 64px;
            padding-left: 25px;
            border-left: 2px solid #EEE;
            font-size: 40px;
        }

        .time {
            height: 70px;
            padding-right: 30px;

            span {
                display: block;
                text-align: center;
                line-height: 35px;
                font-size: 24px;

                &:nth-child(1) {
                    font-size: 32px;
                }
            }
        }
    }

    .picture {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;

        img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
`;

const HomeHead = function HomeHead(props) {
    const navigate = useNavigate();
    let { today, info, queryUserInfoAsync } = props;
    // 当依赖项改变时才会变化，否则就拿渲染的值
    let time = useMemo(() => {
        let [, month, day] = today.match(/^\d{4}(\d{2})(\d{2})$/),
            area = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
        return {
            month: area[+month] + '月',
            day
        }
    }, [today])
    // 第一次渲染完，info中没有信息，派发获取到登陆者信息
    useEffect(() => {
        if (!info) {
            queryUserInfoAsync();
        }
    }, []);

    return (
        <HomeHeadBox>
            <div className="info">
                <div className="time">
                    <span>{time.day}</span>
                    <span>{time.month}</span>
                </div>
                <h2 className="title">知乎日报</h2>
            </div>
            <div className="picture" onClick={()=>{navigate('/personal')}}>
                <img src={info ? info.pic : head_jpg} alt="头像" />
            </div>
        </HomeHeadBox>
    )
};
export default connect(
    state => state.base,
    actions.base
)(HomeHead);

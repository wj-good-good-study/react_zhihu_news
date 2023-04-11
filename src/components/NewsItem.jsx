import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'antd-mobile';
import PropTypes from 'prop-types'
import styled from 'styled-components';

const NewsItemBox = styled.div`
    padding: 15px 0;
    position: relative;
    height: 150px;

    a {
        display: block;
        height: 100%;
        &:visited {
            .content{
                .title{
                    color: #999;
                }
                .author{
                    color: @aaa;
                }
            }
        }
    }

    .content {
        margin-right: 160px;
        .title{
            font-size: 28px;
            line-height: 45px;
            color: #000;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
        }
        .author{
            font-size: 24px;
            color: #999;
            line-height: 40px;
        }
    }

    .adm-image {
        position: absolute;
        right: 0;
        top: 15px;
        width: 130px;
        height: 130px;

        .adm-image-tip {
            svg {
                height: 40%;
                width: 40%;
            }
        }

        img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
`;

export default function NewsItem(props) {

    let { info } = props;
    if (!info) return null;
    let { id, title, hint, images, image } = info;
    if (!images) images = [image];
    if (!Array.isArray(images)) images = [""];
    return (
        <NewsItemBox>
            <Link to={{ pathname: `/detail/${id}` }} >
                <div className="content">
                    <h4 className="title">{title}</h4>
                    {hint ? <p className="author">{hint}</p> : null}
                </div>
                <Image lazy src={images[0]} />
            </Link>
        </NewsItemBox>
    )
};
NewsItem.defaultProps = {
    info: null
}
NewsItem.propTypes = {
    info: PropTypes.object
}

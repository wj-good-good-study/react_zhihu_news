import React, { useEffect } from "react";
import styled from "styled-components";
import { SwipeAction, Toast } from "antd-mobile";
import NewsItem from '../components/NewsItem';
import NavBarAgain from "../components/NavBarAgain";
import SkeletonAgain from '../components/SkeletonAgain';
import { connect } from "react-redux";
import actions from "../store/actions";
import api from "../api";

const StoreBox = styled.div`
    .box {
        padding:30px;
    }
`;
const Store = function Store(props) {
    let { list: storeList, queryStoreListAsync, removeStoreListById } = props;
    useEffect(() => {
        if (!storeList) {
            queryStoreListAsync();
        }
    }, []);

    const handleRemove = async (id) => {
        try {
            let { code } = await api.storeRemove(id);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: "移除失败"
                });
                return;
            }
            Toast.show({
                icon: 'success',
                content: "移除成功"
            });
            removeStoreListById(id);
        } catch (error) { }
    }
    return (
        <StoreBox>
            <NavBarAgain title="我的收藏" />
            {storeList ?
                <div className="box">
                    {storeList.map(item => {
                        let { id, news } = item;
                        return (
                            <SwipeAction key={id} rightActions={[{
                                key: 'delete',
                                text: '删除',
                                color: 'danger',
                                onClick: handleRemove.bind(null, id)
                            }]}>
                                <NewsItem info={news} />
                            </SwipeAction>
                        )
                    })}
                </div> :
                <SkeletonAgain />
            }
        </StoreBox>
    )
};
export default connect(
    state => state.store,
    { ...actions.store }
)(Store);
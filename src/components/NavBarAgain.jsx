import React from 'react';
import PropTypes from 'prop-types'
import { NavBar } from 'antd-mobile';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const NavBarAgainBox = styled.div`
    padding: 0 20px;
    height: 80px;
    .adm-nav-bar-title{
        font-size: 30px;
        font-weight: 900;
    }
    .adm-nav-bar-back-arrow{
        font-size: 36px;
    }
`;

const NavBarAgain = function NavBarAgain(props) {
    let { title } = props;
    const navigate = useNavigate(),
        location = useLocation(),
        [usp] = useSearchParams();
    const handleBack = () => {
        // 复杂业务
        // 特殊跳转：登录页&to的值是/detail/xxx
        let to = usp.get('to');
        if (location.pathname === '/login' && /^\/detail\/\d+$/.test(to)) {
            navigate(to, { replace: true });
            return;
        }
        navigate(-1);
    };

    return (
        <NavBarAgainBox>
            <NavBar onBack={handleBack}>
                {title}
            </NavBar>
        </NavBarAgainBox>

    )
};
NavBarAgain.defaultProps = {
    title: '个人中心'
};
NavBarAgain.propTypes = {
    title: PropTypes.string
};
export default NavBarAgain;

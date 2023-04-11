import React from 'react';
import { Skeleton } from 'antd-mobile';
import styled from 'styled-components';

const SkeletonAgainBox = styled.div`
    padding:20px 30px;

    .adm-skeleton-title {
        height: 50px;
        margin: 30px 0;
    }
    .adm-skeleton-paragraph-line {
        margin: 20px 0;
        height: 32px;
    }
`;

export default function SkeletonAgain() {
    return (
        <SkeletonAgainBox>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={5} animated />
        </SkeletonAgainBox>
    )
};

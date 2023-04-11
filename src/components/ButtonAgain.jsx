import React from "react";
import { useState } from "react";
import { Button } from "antd-mobile";
// 防抖按钮
const ButtonAgain = function ButtonAgain(props) {
    // props中包含调用<Button>的属性
    let options = { ...props };
    let { children, onClick: handle } = options;
    // 删除children是children因为在解构时会添加到标签上
    delete options.children;
    // 状态
    let [loading, setLoading] = useState(false);
    const clickHandle = async () => {
        setLoading(true);
        try {
            await handle();
        } catch (error) { }
        setLoading(false);
    };
    // 如果有点击事件，就增加loading事件，如果没有也不需要删除
    if (handle) {
        options.onClick = clickHandle;
    }
    return (
        <Button {...options} loading={loading}>
            {children}
        </Button>
    )
};
export default ButtonAgain;

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { bindActionCreators } from "redux";

const ThemeContext = createContext();
export function Provider(props) {
    let { store, children } = props;
    return (
        <ThemeContext.Provider value={{ store }}>
            {children}
        </ThemeContext.Provider>
    )
};

// connect:获取上下文中的store，把公共状态、要派发的方法等，基于属性传递给需要渲染的组件，把组件更新的方法放在redux事件池中
export function connect(mapStateToProps, mapDispatchToProps) {
    // 不写什么都不传递
    if (!mapStateToProps) {
        mapStateToProps = () => {
            return {};
        }
    }
    // 不写传递给组件dispatch方法
    if (!mapDispatchToProps) {
        mapDispatchToProps = (dispatch) => {
            return {
                dispatch
            };
        }
    }
    return function currying(Component) {
        return function HOC(props) {
            // 获取上下文的store
            let { store } = useContext(ThemeContext),
                { getState, dispatch, subscribe } = store;
            // 向事件池中加入让组件更新的方法
            let [, forceUpdate] = useState(0);
            useEffect(() => {
                let unsubscribe = subscribe(() => {
                    forceUpdate(+new Date());
                });
                return () => {
                    // 移除事件池中的方法
                    unsubscribe();
                }
            }, []);
            // 把mapStateToProps和mapDispatchToProps执行，把返回值作为属性传给组件
            let nextState = useMemo(() => {
                return mapStateToProps(getState);
            }, [state]);
            let dispatchProps = {};
            if (typeof mapDispatchToProps === 'function') {
                // 函数对象
                dispatchProps = mapDispatchToProps(dispatch);
            } else {
                // actionCreator对象
                dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
            }
            return <Component {...props} {...nextState} {...dispatchProps} />
        };
    };
};
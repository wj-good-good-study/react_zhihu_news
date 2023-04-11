import React, { useState, useEffect } from 'react';
import { Form, Input, Toast } from 'antd-mobile';
import NavBarAgain from '../components/NavBarAgain';
import ButtonAgain from '../components/ButtonAgain';
import { connect } from 'react-redux';
import actions from '../store/actions'
import api from '../api';
import _ from '../assets/utils';
import styled from 'styled-components';
// 样式
const LoginBox = styled.div`
    .adm-form {
        padding: 30px;
    }

    .adm-form-footer {
        .adm-button {
            display: block;
            margin: 0 auto;
            width: 60%;
            height: 70px;
            font-size: 28px;
            border-radius: 0;
        }
    }

    .adm-form-item {
        font-size: 28px;
    }

    .adm-list-item-content-extra {
        .adm-button {
            width: 160px;
            font-size: 24px;
            border-radius: 0;
        }
    }
`;

// 自定义表单校验规则，需要返回一个Promise
const vaildate = {
    phone(_, value) {
        value = value.trim();
        let reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
        if (value.length === 0) return Promise.reject(new Error('手机号为必填项!'));
        if (!reg.test(value)) return Promise.reject(new Error('手机号格式有误!'));
        return Promise.resolve();
    },
    code(_, value) {
        value = value.trim();
        let reg = /^\d{6}$/;
        if (value.length === 0) return Promise.reject(new Error('验证码为必填项!'));
        if (!reg.test(value)) return Promise.reject(new Error('验证码格式有误!'));
        return Promise.resolve();
    }
}

const Login = function Login(props) {
    // redux
    let { queryUserInfoAsync, navigate, usp } = props;

    // 定义状态
    const [formIns] = Form.useForm(),
        [disabled, setDistabled] = useState(false),
        [sendText, setSendText] = useState('发送验证码');
    // 表单校验成功后执行的，自动收集数据
    const dealy = (interval = 1000) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, interval);
        })
    }
    const submit = async () => {
        try {
            await formIns.validateFields();
            let { phone, code } = formIns.getFieldsValue();
            let { code: codeHttp, token } = await api.Login(phone, code);
            if (+codeHttp !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '登陆失败'
                });
                formIns.resetFields(['code']);
                return;
            }
            // 登陆成功，存储token、登陆者信息刀redux、提示、跳转
            _.storage.set('tk', token);
            // 派发任务，同步redux中的状态信息
            await queryUserInfoAsync();
            Toast.show({
                icon: 'success',
                content: '登陆/注册成功!'
            });
            let to = usp.get('to');
            to ? navigate(to, { replace: true }) : navigate(-1);

        } catch (error) { console.log(error) }
    }
    // 发送验证码
    let timer = null,
        num = 31;
    const countDown = () => {
        num--;
        if (num === 0) {
            clearInterval(timer);
            timer = null;
            setSendText(`发送验证码`);
            setDistabled(false);
            return;
        }
        setSendText(`${num}秒后重发`);
    };
    const send = async () => {
        try {
            await formIns.validateFields(['phone']);
            let phone = formIns.getFieldValue('phone');
            let { code } = await api.sendPhoneCode(phone);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '发送失败'
                });
                return;
            }
            setDistabled(true);
            countDown();
            if (!timer) timer = setInterval(countDown, 1000);
            // 手机号格式通过
        } catch (error) {
            console.log(error);
        }
    }
    // 清除定时器
    useEffect(() => {
        return () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }
    }, [])

    return (
        <LoginBox>
            <NavBarAgain title="登录/注册" />
            <Form
                layout='horizontal'
                style={{ '--border-top': 'none' }}
                footer={
                    <ButtonAgain
                        color='primary'
                        onClick={submit}>
                        提交
                    </ButtonAgain>
                }
                // onFinish={submit} 放弃内置的提交
                form={formIns}
                initialValues={{ phone: '', code: '' }}
            >
                <Form.Item name='phone' label='手机号'
                    rules={[{ validator: vaildate.phone }]}>
                    <Input placeholder='请输入手机号' />
                </Form.Item>

                <Form.Item name='code' label='验证码'
                    rules={[{ validator: vaildate.code }]}
                    extra={
                        <ButtonAgain size='small'
                            color='primary'
                            disabled={disabled}
                            onClick={send}>
                            {sendText}
                        </ButtonAgain>
                    }
                >
                    <Input />
                </Form.Item>
            </Form>
        </LoginBox>
    )
};
export default connect(null, actions.base)(Login);

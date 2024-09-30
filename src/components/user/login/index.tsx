import React, { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { accountService } from '../../../services/accountService';
import { Button, Checkbox, Divider, Form, Input, message } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { LoginModel } from '../../../models/LoginModel';
import { storageService } from '../../../services/storageService';
import user from '../../../store/userStore'
import { addToCartAll } from '../../../store/redux/cart/redusers/CartReduser';
import { useDispatch } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { APP_ENV } from '../../../env';
import GoogleLoginButton from '../../buttons/google-login-button';
import { GoogleOutlined } from '@ant-design/icons';
import { GoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export const Login: React.FC = () => {
    const [remember, setRemember] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatcher = useDispatch();
    const [loginModel, setLoginModel] = useState<LoginModel>();

    const onVerify = useCallback(async (token: string) => {
        if (loginModel) {
            loginModel.recaptchaToken = token;
            const responce = await accountService.login(loginModel);
            if (responce.status === 200) {
                await login(responce.data.token)
            }
        }
    }, [loginModel]);

    const login = async (token: string) => {
        await storageService.saveToken(token, !remember);
        user.setUserData(token);
        if (user.isAuthorized) {
            if (!user.isAdmin) {
                const localCard = storageService.getLocalCart();
                if (localCard.length > 0) {
                    await accountService.addAllToCart(localCard.map(x => ({ id: x.product.id, count: x.count })))
                }
                const result = await accountService.getCart();
                if (result.status === 200) {
                    dispatcher(addToCartAll(result.data))
                    storageService.clearCart();
                }
            }
            navigate('/')
            message.success('Ви успішно увійшли в свій акаунт')
        }
        else {
            message.success('Помилка авторизації')
        }
    }

    return (

        <GoogleOAuthProvider clientId={APP_ENV.CLIENT_ID}>
            <GoogleReCaptchaProvider reCaptchaKey={APP_ENV.RECAPTCHA_SITE_KEY}>
                <div className=' w-70 mx-auto my-4'>
                    <div className='w-50 mx-auto'>
                        <Divider className='fs-3 border-dark-subtle mb-5' orientation="left">Логін</Divider>

                        <Form
                            layout='vertical'
                            style={{
                                maxWidth: 600,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={setLoginModel}
                            className='mx-auto'
                        >
                            <Form.Item
                                label="Логін"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: "Будьласка введіть логін!",
                                    }
                                ]}
                            >
                                <Input type='large' />
                            </Form.Item>

                            <Form.Item
                                label="Пароль"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Будьласка введіть пароль!',
                                    },
                                ]}
                            >
                                <Input.Password type='large' />
                            </Form.Item>

                            <Form.Item
                                // valuePropName='checked'
                                name='remember'>
                                <Checkbox checked={remember} onChange={(e: CheckboxChangeEvent) => setRemember(e.target.checked)}>Запам'ятати мене</Checkbox>
                            </Form.Item>
                            <div className='buttons-block'>
                                <Button type="primary" htmlType="submit">
                                    Увійти
                                </Button>
                                <Link to="/registration">
                                    <Button >Реєстрація</Button>
                                </Link>
                                <Link to='/fogotpassword'>Забули раполь?</Link>
                                <GoogleLoginButton icon={<GoogleOutlined />} title='Увійти з Google' onLogin={login} />
                            </div>
                            <GoogleReCaptcha onVerify={onVerify} />
                        </Form>
                    </div>
                </div>
            </GoogleReCaptchaProvider>

        </GoogleOAuthProvider >

    )
}


import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { accountService } from '../../../services/accountService';
import { Button, Checkbox, Divider, Form, Input, message } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { LoginModel } from '../../../models/LoginModel';
import { storageService } from '../../../services/storageService';
import user from '../../../store/userStore'
import { addToCartAll } from '../../../store/redux/cart/redusers/CartReduser';
import { useDispatch } from 'react-redux';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { APP_ENV } from '../../../env';

export const Login: React.FC = () => {
    const [remember, setRemember] = useState<boolean>(false);
    const navigate = useNavigate()
    const dispatcher = useDispatch();

    const onFinish = async (loginModel: LoginModel) => {
        const responce = await accountService.login(loginModel);
        if (responce.status === 200) {
            await storageService.saveToken(responce.data.token, !remember);
            user.setUserData(responce.data.token);
            if (user.isAuthorized && !user.isAdmin) {
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
    }
    return (
        <GoogleOAuthProvider clientId={APP_ENV.CLIENT_ID}>
            <div className=' w-70 mx-auto my-4'>
            </div>
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
                    onFinish={onFinish}
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
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                console.log(credentialResponse);
                                navigate('/')
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </div>
                </Form>
            </div>

        </GoogleOAuthProvider>
    )
}


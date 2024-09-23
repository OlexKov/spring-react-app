import { Link, useNavigate } from "react-router-dom";
import logo from '../../../../logo.png';
import { Menu } from "../../menu";
import { observer } from "mobx-react";
import user from '../../../store/userStore'
import { DownOutlined, FlagOutlined, HeartOutlined, LogoutOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown } from "antd";
import { APP_ENV } from "../../../env";
import { storageService } from "../../../services/storageService";
import { ReactNode, useEffect, useState } from "react";
import '../header/header.css'

interface MenuItem {
    label: ReactNode
    key: string
    icon: ReactNode
    users: string[]
}
const Header: React.FC = observer(() => {
    const navigate = useNavigate();

    const logout = async () => {
        storageService.removeTokens();
        user.clearUserData();
        navigate('/')
    }

    useEffect(() => {
        if (user.isAuthorized) {
            if (user?.isAdmin)
                setUserMenuItems(items.filter(x => x.users.includes('Admin')))
            else
                setUserMenuItems(items.filter(x => x.users.includes('User')))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.username])
    const items: MenuItem[] = [
        {
            label: <Link to="account">
                <Button type="link">{user.name} {user.surname}</Button></Link>,
            key: '0',
            icon: <Avatar src={APP_ENV.SERVER_HOST + APP_ENV.IMAGES_FOLDER + '/150_' + user.avatar} />,
            users: ['User', 'Admin']
        },

        {
            label: <Link to="useradverts">
                <Button type="link">Moї продукти</Button>
            </Link>,
            key: '2',
            icon: <FlagOutlined className='fs-6' />,
            users: ['User']
        },
        {
            label: <Button onClick={logout} type="link">Вийти</Button>,
            key: '3',
            icon: <LogoutOutlined className='fs-6' />,
            users: ['User', 'Admin']
        }
    ]
    const [userMenuItems, setUserMenuItems] = useState<MenuItem[]>(items);

    return (
        <header>
            <div className=' h-100 mx-auto d-flex  justify-content-between align-items-center'>
                <div className="d-flex gap-4 w-100">
                    <img onClick={() => navigate('/')} style={{ marginLeft: 30, marginRight: '5%', height: 45, width: 45, cursor: 'pointer' }} src={logo} alt='logo' />
                    <Menu />
                </div>

                <div className=' d-flex gap-5 mx-4 '>
                    {!user.isAdmin &&
                        <Badge size="small" count={user.favCount}>
                            <HeartOutlined className='favourite-button' onClick={() => navigate('/favorites')} />
                        </Badge>}
                    {(user.isAuthorized &&
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            trigger={['click']}>
                            <div className='user-profile-button d-flex gap-2 align-items-center'>
                                {user.isAdmin ? <SafetyCertificateOutlined className=" text-danger fs-5" /> : <UserOutlined className=" text-success fs-5" />}
                                <span className=" text-nowrap">Ваш профіль</span>
                                <DownOutlined />
                            </div>
                        </Dropdown>) ||
                        <div className='user-profile-button d-flex gap-2 align-items-center ' onClick={() => navigate('/login')}>
                            <UserOutlined className="fs-5" />
                            <span className=" text-nowrap">Ваш профіль</span>
                        </div>}
                </div>
            </div>
        </header>
    );
});

export default Header;



import { Link, useNavigate } from "react-router-dom";
import logo from '../../../../logo.png';
import { Menu } from "../../menu";
import { observer } from "mobx-react";
import user from '../../../store/userStore'
import { DownOutlined, FlagOutlined, HeartOutlined, LogoutOutlined, SafetyCertificateOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Popover } from "antd";
import { APP_ENV } from "../../../env";
import { storageService } from "../../../services/storageService";
import { ReactNode, useEffect, useState } from "react";
import '../header/header.css'
import { useSelector } from "react-redux";
import { RootState } from "../../../store/redux/basket"
import { BasketProduct } from "../../../models/BasketProduct";
import { SmallBasketProduct } from "../../product/ProductCard/small-basket-product-card";
import { useDispatch } from "react-redux";
import { getTotalDiscount, getTotalPrice, setCount } from "../../../store/redux/basket/redusers/BasketReduser";

interface MenuItem {
    label: ReactNode
    key: string
    icon: ReactNode
    users: string[]
}

const Header: React.FC = observer(() => {
    const navigate = useNavigate();
    const basket: BasketProduct[] = useSelector((state: RootState) => state.backetStore.basket);
    const totalPrice: number = useSelector((state: RootState) => getTotalPrice(state));
    const totalDiscount: number = useSelector((state: RootState) => getTotalDiscount(state));
    const dispatcher = useDispatch();
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
            users: ['User', 'Admin'],
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
    const onCountChange = (count: number, id: number) => {
        dispatcher(setCount({ count, id }))
    }

    return (
        <header>
            <div className=' h-100 mx-auto d-flex  justify-content-between align-items-center'>
                <div className="d-flex gap-4 w-100">
                    <img onClick={() => navigate('/')} style={{ marginLeft: 30, marginRight: '5%', height: 45, width: 45, cursor: 'pointer' }} src={logo} alt='logo' />
                    <Menu />
                </div>

                <div className=' d-flex gap-5 mx-4 '>
                    {!user.isAdmin &&
                        <div className="d-flex gap-5">
                            <Badge size="small" count={user.favCount}>
                                <HeartOutlined className='icon-button' onClick={() => navigate('/favorites')} />
                            </Badge>
                            <Badge size="small" count={basket.length}>
                                <Popover placement="bottom" content={
                                    basket.length > 0
                                        ? <div className="d-flex flex-column gap-2">
                                            <div style={{maxHeight:400}} className="d-flex flex-column gap-4 overflow-auto">
                                                {basket.map(x => <SmallBasketProduct onCountClick={onCountChange} basketProduct={x} />)}
                                            </div>
                                            
                                            <div className="d-flex flex-column gap-2">
                                                <span className="text-danger fs-6">Total price: {totalPrice.toFixed(2)} .грн</span>
                                                <span className="text-success fs-6">Discount: {totalDiscount.toFixed(2)} .грн</span>
                                            </div>
                                        </div>
                                        : null
                                }>
                                    <ShoppingCartOutlined className='icon-button' onClick={() => navigate('/basket')} />
                                </Popover>

                            </Badge>
                        </div>}
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



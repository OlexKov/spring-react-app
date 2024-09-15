import React, { useEffect, useState } from 'react'
import {  HomeOutlined,   TableOutlined} from '@ant-design/icons';
import { Menu as AntMenu,} from 'antd';
import { Link, useLocation } from 'react-router-dom';
import './menu.css'
import { ItemType, MenuItemType } from 'antd/es/menu/interface';



const items :ItemType<MenuItemType>[]= [
    {
        key: "/",
        icon:<HomeOutlined className='fs-6' />,
        label:<Link className='link' to="/">Номе</Link>,
       
    },
    {
        key: "/products",
        icon:<TableOutlined className='fs-6'/>,
        label:<Link  className='link' to="/products"><span>Product table</span></Link>,
      
    },
    {
        key: "/categories",
        icon:<TableOutlined className='fs-6'/>,
        label:<Link  className='link' to="/categories"><span>Category table</span></Link>,
      
    }
]

export const Menu :React.FC = () => {
    const location = useLocation();
    const [current, setCurrent] = useState(location.pathname);
    useEffect(() => {
        if (location) {
            if( current !== location.pathname ) {
                setCurrent(location.pathname);
            }
        }
    }, [location, current]);

    

    function handleClick(e) {
        setCurrent(e.key);
    }
    return (
        <AntMenu
            onClick={handleClick}
            theme="dark"
            mode="horizontal"
            selectedKeys={[current]}
            className='menu'
            items = { items }
        />)
}
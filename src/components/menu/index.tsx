import React, { useEffect, useState } from 'react'
import {  HomeOutlined,   TableOutlined} from '@ant-design/icons';
import { Menu as AntMenu,} from 'antd';
import { Link, useLocation } from 'react-router-dom';
import './menu.css'
import user from '../../store/userStore'
import { MenuItem } from '../../models/MenuItem';


const items :MenuItem[]= [
    {
        key: "/",
        icon:<HomeOutlined className='fs-6' />,
        label:<Link className='link' to="/">Номе</Link>,
        users: ['Guest','User','Admin']
       
    },
    {
        key: "/products",
        icon:<TableOutlined className='fs-6'/>,
        label:<Link  className='link' to="/products"><span>Product table</span></Link>,
        users: ['Admin']
    },
    {
        key: "/categories",
        icon:<TableOutlined className='fs-6'/>,
        label:<Link  className='link' to="/categories"><span>Category table</span></Link>,
        users: ['Admin']
    }
]



export const Menu :React.FC = () => {
    const location = useLocation();
    const [current, setCurrent] = useState(location.pathname);
    const [menuItems,setMenuItems] = useState<MenuItem[]>(items.filter(x=> x?.users?.includes('Guest')))
    useEffect(() => {
        if (location) {
            if( current !== location.pathname ) {
                setCurrent(location.pathname);
            }
        }
    }, [location, current]);

    
    useEffect(()=>{
        let itemArray:MenuItem[] = []; 
        if(!user.isAuthorized)
           itemArray = items.filter(x=> x?.users?.includes('Guest'));
        else if(user.isAdmin)
            itemArray = items.filter(x=>x?.users?.includes('Admin'))
        else 
            itemArray = items.filter(x=>x?.users?.includes('User'))
          setMenuItems(itemArray)
     },[user.username]);

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
            items = { menuItems}
        />)
}
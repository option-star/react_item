import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
} from '@ant-design/icons';
import './index.css';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

const { Sider } = Layout;
const { SubMenu } = Menu;

/* 路由与图标映射 */
const iconList = {
    "/home": <UserOutlined />,
    "/user-manage": <UserOutlined />,
    "/user-manage/list": <UserOutlined />,
    "/right-manage": <UserOutlined />,
    "/right-manage/role/list": <UserOutlined />,
    "/right-manage/right/list": <UserOutlined />
}

/* 侧边栏 */
function SideMenu(props) {

    const [meun, setMeun] = useState([]);

    /* 侧边栏数据获取 */
    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            setMeun(res.data)
        })
    }, [])

    const checkPagePermission = (item) => {
        return item.pagepermisson === 1
    }

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children?.length > 0 && checkPagePermission(item)) {
                return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }

            return checkPagePermission(item) && <Menu.Item key={item.key} icon={item.icon} onClick={() => {
                /* 路由跳转 */
                props.history.push(item.key)
            }}>{item.title}</Menu.Item>
        })
    }

    const selectKeys = [props.location.pathname];
    const openKeys = ["/" + props.location.pathname.split("/")[1]]
    return (
        <Sider trigger={null} collapsible collapsed={false}>
            <div style={{ display: 'flex', height: "100%", "flexDirection": "column" }}>
                <div className="logo" >管理系统</div>
                <div style={{ flex: 1, "overflow": "auto" }}>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={selectKeys} defaultOpenKeys={openKeys}>
                        {renderMenu(meun)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}

export default withRouter(SideMenu);

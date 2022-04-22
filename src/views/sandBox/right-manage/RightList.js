import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { confirm } = Modal;

export default function RightList() {
    const [dataSource, setDataSource] = useState([])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <div>{id}</div>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="green">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div style={{ display: "flex", justifyContent: "space-around" }} >
                        <Popover content={<div style={{ textAlign: "center" }}>
                            <Switch checked={item.pagepermisson} onChange={() => {
                                switchMethod(item);
                            }}></Switch>
                        </div>} title="配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
                            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
                        </Popover>
                        <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    </div>
                )
            }
        },
    ];

    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            const list = res.data;
            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ""
                }
            });
            setDataSource(list)
        })
    }, [])

    const confirmMethod = (item) => {
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    /* 删除 */
    const deleteMethod = (item) => {
        if (item.grade === 1) {
            /* 更新页面展示 */
            setDataSource(dataSource.filter(data => data.id !== item.id));
            /* 更新数据库 */
            axios.delete(`http://localhost:5000/rights/${item.id}`);
        } else {
            let list = dataSource.filter(data => data.id === item.rightId)
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            setDataSource([...dataSource])
            axios.delete(`http://localhost:5000/children/${item.id}`)
        }
    }

    /* 更改状态 */
    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        setDataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`http://localhost:5000/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`http://localhost:5000/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
    }

    return (
        <div><Table dataSource={dataSource} columns={columns}
            pagination={{
                pageSize: 5,
            }}
        /></div>
    )
}

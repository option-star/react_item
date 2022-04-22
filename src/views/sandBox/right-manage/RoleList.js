import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal


export default function RoleList() {
    /* 表格数据 */
    const [dataSource, setDataSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentRights, setCurrentRights] = useState([])
    const [currentId, setCurrentId] = useState(0)

    /* 控制弹窗是否可见 */
    const [isModalVisible, setIsModalVisible] = useState(false)

    /* 表格标题数据 */
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: "操作",
            render: (item) => {
                return <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
                        setIsModalVisible(true)
                        setCurrentRights(item.rights)
                        setCurrentId(item.id)
                    }} />
                </div>
            }
        }
    ]

    /* 删除提示弹窗 */
    const confirmMethod = (item) => {
        confirm({
            title: "你确定要删除?",
            icon: <ExclamationCircleOutlined />,
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
            },

        })
    }

    /* 删除角色数据 */
    const deleteMethod = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`http://localhost:5000/roles/${item.id}`)
    }

    /* useEffect渲染后调用 */
    useEffect(() => {
        axios.get("http://localhost:5000/roles").then(res => {
            setDataSource(res.data)
        })
    }, [])

    /* 渲染后获取权限数据 */
    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            setRightList(res.data)
        })
    })

    /* 点击确认关闭弹窗 */
    const handleOK = () => {
        // 关闭弹窗
        setIsModalVisible(false);

        // 同步datasource
        setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))

        // 同步数据库数据
        axios.patch(`http://localhost:5000/roles/${currentId}`, {
            rights: currentRights
        })
    }

    /* 点击取消关闭弹窗 */
    const handleCancel = () => {
        setIsModalVisible(false);
    }

    /* 点击复选框触发 */
    const onCheck = (checkKeys) => {
        setCurrentRights(checkKeys.checked)
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOK} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    checkStrictly={true}
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}

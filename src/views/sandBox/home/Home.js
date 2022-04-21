import React from 'react'
import { Button } from 'antd';
import axios from 'axios'

export default function Home() {
    /* 
        json-server
        - get 获取
        - post 新增
        - put 全局修改
        - patch 局部修改
        - delete 删除
        - _embed : 向下关联
        - _expand : 向上关联
    */

    const ajax = () => {
        // 取数据
        axios.get("http://localhost:5000/posts").then((res) => {
            console.log(res.data)
        })
    }

    return (
        <div>
            <Button type="primary" onClick={ajax}>Button</Button>
        </div>
    )
}

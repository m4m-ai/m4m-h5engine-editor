import React, { useRef, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './projectWindow.module.scss'
import { EditorEventMgr } from "../../../../Game/Event/EditorEventMgr";
import { AppContext } from '../../../../App'

import { Button, Input, Space, Table } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { CodeEditorReference } from '../../../../CodeEditor/code/CodeEditorReference';
import { WebsocketTool } from '../../../../CodeEditor/code/WebsocketTool';
import { WindowManager } from '../../../window/WindowManager';
// import Highlighter from 'react-highlight-words';

interface DataType {
    key: string;
    name: string;
    address: string;
}

type DataIndex = keyof DataType;

const projectList: DataType[] = [];

function ProjectWindow(props) {
    let [proList, setValue] = useState(projectList);
    useEffect(() => {

        let binder = EditorEventMgr.Instance.addEventListener('ProjectListRefresh', (data) => {
            let list = [];
            for (const key in data) {
                let proObj = data[key];
                // console.error(key,proObj);
                let dataTypeObj = {
                    key: proObj.id,
                    name: proObj.projectName,
                    address: proObj.projectPath// proObj.projectDesc,
                }
                list.push(dataTypeObj);
            }
            setValue(list);
            projectList.length = 0;
            projectList.push(...list);
            
            //临时处理， 如果不存在项目， 则创建test1
            if (projectList.findIndex((value) => value.name == 'test1') == -1) {
                WebsocketTool.Instance.ProjectManager_creatProject("test1");
            }
        });
        //console.log("开始连服务器");
        //连接服务器
        CodeEditorReference.connectWebSocket();
        return () => {
            binder.removeListener();
        }
    }, []);

    const navigate = useNavigate()
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const { setIsHomePage } = useContext(AppContext)

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            // antd 源码里没有这个 prop了
                            // close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) => (
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase())
        ),
        // onFilterDropdownOpenChange: (visible) => {
        //     if (visible) {
        //         setTimeout(() => searchInput.current?.select(), 100);
        //     }
        // },
        render: (text) => text,
        // searchedColumn === dataIndex ? (
        //     <Highlighter
        //     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        //     searchWords={[searchText]}
        //     autoEscape
        //     textToHighlight={text ? text.toString() : ''}
        //     />
        // ) : (
        //     text
        // ),
    });

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ...getColumnSearchProps('address'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
    ];

    const clickRow = (record: DataType) => {
        setIsHomePage(true)
        //打开项目事件
        EditorEventMgr.Instance.emitEvent("OnOpenProject", cb => cb(record.name));
    }
    const createProject = () => {
        ///console.log('创建新工程');
        //暂时写死工程名  需要UI可输入创建的工程名
        // WebsocketTool.Instance.ProjectManager_creatProject("test1");
        WindowManager.showCreateProjectWindow()
    }

    return (
        <div className={style.box}>
            <div className="main-header">
                <div className="main-title">Project</div>
                <div className="header-operation">
                    {/* 未实现功能屏蔽: 导入工程 */}
                    {/* <Button className="add-btn">添加</Button> */}
                    <Button className="create-btn" type="primary" onClick={createProject}>Create</Button>
                </div>
            </div>

            <div className="main-content">
                <Table columns={columns} dataSource={proList} pagination={false}
                    onRow={record => {
                        return {
                            onClick: event => clickRow(record), // 点击行
                            onDoubleClick: event => { },
                            onContextMenu: event => { },
                        };
                    }}
                />
            </div>
        </div>
    )
}

export default ProjectWindow
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    getTables,
    getAreas,
    createTable,
    updateTable,
    deleteTable
} from '../../services/TableAPI';
const { Option } = Select;

function QL_Table() {
    const [tableList, setTableList] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
    setLoading(true);
    try {
        const tableRes = await getTables();
        const areaRes = await getAreas();

        setTableList(tableRes.data || []);
        setAreas(areaRes.data || []);

    } catch (err) {
        message.error('Không thể tải dữ liệu');
    } finally {
        setLoading(false);
    }
};
    useEffect(() => {
        fetchData();
    }, []);

   const handleSubmit = async (values) => {
    try {
        if (editingTable) {
            await updateTable({
                table_id: editingTable.table_id,
                table_name: values.table_name,
                table_area_id: values.table_area_id
            });
            message.success('Cập nhật bàn thành công');
        } else {
            await createTable(values);
            message.success('Thêm bàn thành công');
        }
        setIsModalOpen(false);
        form.resetFields();
        setEditingTable(null);
        fetchData();
    } catch (err) {
        message.error('Có lỗi xảy ra');
    }
};

    const handleDelete = async (id) => {
    try {
        await deleteTable(id);
        message.success('Xóa bàn thành công');
        fetchData();
    } catch {
        message.error('Có lỗi xảy ra');
    }
};

    const openModal = (record = null) => {
        if (record) {
            setEditingTable(record);
            form.setFieldsValue(record);
        } else {
            setEditingTable(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'STT',
            render: (_, __, index) => index + 1
        },
        {
            title: 'Tên bàn',
            dataIndex: 'table_name'
        },
        {
            title: 'Khu vực',
            dataIndex: 'table_area_id',
            render: (id) => {
                const area = areas.find(a => a.table_area_id === id);
                return <Tag>{area?.table_area_name}</Tag>;
            }
        },
        {
            title: 'Thao tác',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.table_id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Quản lý bàn</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Thêm bàn
                </Button>
            </div>

            <Table
                dataSource={tableList}
                columns={columns}
                rowKey="table_id"
                loading={loading}
            />

            <Modal
                open={isModalOpen}
                title={editingTable ? 'Sửa bàn' : 'Thêm bàn'}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="table_name" label="Tên bàn" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="table_area_id" label="Khu vực" rules={[{ required: true }]}>
                        <Select>
                            {areas.map(a => (
                                <Option key={a.table_area_id} value={a.table_area_id}>
                                    {a.table_area_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        {editingTable ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
}

export default QL_Table;

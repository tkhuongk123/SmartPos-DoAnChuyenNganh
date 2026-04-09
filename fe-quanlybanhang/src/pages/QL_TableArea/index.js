import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    getAreas,
    createArea,
    updateArea,
    deleteArea
} from '../../services/TableAPI';

function QL_TableArea() {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAreas();
            setAreas(res.data || []);
        } catch {
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
            if (editingArea) {
                await updateArea({
                    table_area_id: editingArea.table_area_id,
                    table_area_name: values.table_area_name
                });
                message.success('Cập nhật khu vực thành công');
            } else {
                await createArea(values);
                message.success('Thêm khu vực thành công');
            }

            setIsModalOpen(false);
            form.resetFields();
            setEditingArea(null);
            fetchData();
        } catch {
            message.error('Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteArea(id);
            message.success('Xóa khu vực thành công');
            fetchData();
        } catch {
            message.error('Có lỗi xảy ra');
        }
    };

    const openModal = (record = null) => {
        if (record) {
            setEditingArea(record);
            form.setFieldsValue(record);
        } else {
            setEditingArea(null);
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
            title: 'Tên khu vực',
            dataIndex: 'table_area_name'
        },
        {
            title: 'Thao tác',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.table_area_id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Quản lý khu vực</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Thêm khu vực
                </Button>
            </div>

            <Table
                dataSource={areas}
                columns={columns}
                rowKey="table_area_id"
                loading={loading}
            />

            <Modal
                open={isModalOpen}
                title={editingArea ? 'Sửa khu vực' : 'Thêm khu vực'}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="table_area_name"
                        label="Tên khu vực"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        {editingArea ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
}

export default QL_TableArea;
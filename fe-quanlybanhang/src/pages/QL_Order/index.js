

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Select, message, Space, Popconfirm, Tag, Input, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {
    layDanhSach,
    layDanhSachTheoNgay,
    layDanhSachTheoOrderMethod,
    updateOrderStatus,
    layDonHangTheoId
} from '../../services/OrderAPI';
import { getTables } from '../../services/TableAPI';
const { Option } = Select;

function QL_Order() {
    const [orderList, setOrderList] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [form] = Form.useForm();
    const [filterMethod, setFilterMethod] = useState('all');

    const fetchData = async () => {
        setLoading(true);
        try {
            let orderRes;
            if (filterMethod === 'all') {
                orderRes = await layDanhSach();
            } else {
                orderRes = await layDanhSachTheoOrderMethod(filterMethod);
            }
            const tablesRes = await getTables();

            setOrderList(orderRes.data || []);
            setTables(tablesRes.data || []);
        } catch (err) {
            message.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterMethod]);

    const handleSubmit = async (values) => {
        try {
            if (editingOrder) {
                await updateOrderStatus(editingOrder.order_id, values.order_status);
                message.success('Cập nhật trạng thái đơn hàng thành công');
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingOrder(null);
            fetchData();
        } catch (err) {
            message.error('Có lỗi xảy ra');
        }
    };

    const openModal = (record = null) => {
        if (record) {
            setEditingOrder(record);
            form.setFieldsValue(record);
        } else {
            setEditingOrder(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const getStatusTag = (status) => {
        const statusMap = {
            'PENDING': { color: 'gold', text: 'Đang chờ' },
            'COOKING': { color: 'orange', text: 'Đang nấu' },
            'COOKED': { color: 'blue', text: 'Nấu xong' },
            'SERVED': { color: 'cyan', text: 'Đã phục vụ' },
            'PAID': { color: 'green', text: 'Đã thanh toán' },
            'CANCELLED': { color: 'red', text: 'Hủy' }
        };
        const s = statusMap[status] || { color: 'default', text: status };
        return <Tag color={s.color}>{s.text}</Tag>;
    };

    const getMethodTag = (method) => {
        const methodMap = {
            'dine_in': 'Tại chỗ',
            'takeaway': 'Mang về',
            'delivery': 'Giao hàng'
        };
        return methodMap[method] || method;
    };

    const columns = [
        {
            title: 'STT',
            render: (_, __, index) => index + 1,
            width: 60
        },
        {
            title: 'ID Đơn Hàng',
            dataIndex: 'order_id',
            width: 80
        },
        {
            title: 'Bàn',
            dataIndex: 'table_id',
            render: (id) => {
                if (!id) return '-';
                const table = tables.find(t => t.table_id === id);
                return table?.table_name || 'N/A';
            },
            width: 80
        },
        {
            title: 'Phương thức',
            dataIndex: 'order_method',
            render: (method) => getMethodTag(method),
            width: 100
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total_amount',
            render: (amount) => {
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(amount);
            },
            width: 120
        },
        {
            title: 'Trạng thái',
            dataIndex: 'order_status',
            render: (status) => getStatusTag(status),
            width: 100
        },
        {
            title: 'Ghi chú',
            dataIndex: 'order_note',
            width: 150,
            ellipsis: true
        },
        {
            title: 'Thao tác',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
                </Space>
            ),
            width: 80
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                <h2>Quản lý đơn hàng</h2>
                <Select
                    defaultValue="all"
                    style={{ width: 200 }}
                    onChange={setFilterMethod}
                >
                    <Option value="all">Tất cả</Option>
                    <Option value="dine_in">Tại chỗ</Option>
                    <Option value="takeaway">Mang về</Option>
                    <Option value="delivery">Giao hàng</Option>
                </Select>
            </div>

            <Table
                dataSource={orderList}
                columns={columns}
                rowKey="order_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1000 }}
            />

            <Modal
                open={isModalOpen}
                title={editingOrder ? 'Cập nhật trạng thái' : 'Thông tin đơn hàng'}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="order_status" label="Trạng thái" rules={[{ required: true }]}>
                        <Select>
                            <Option value="PENDING">Đang chờ</Option>
                            <Option value="COOKING">Đang nấu</Option>
                            <Option value="COOKED">Nấu xong</Option>
                            <Option value="SERVED">Đã phục vụ</Option>
                            <Option value="PAID">Đã thanh toán</Option>
                            <Option value="CANCELLED">Hủy</Option>
                        </Select>
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        Cập nhật
                    </Button>
                </Form>
            </Modal>
        </div>
    );
}

export default QL_Order;

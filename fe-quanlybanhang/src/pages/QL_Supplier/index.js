import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { layDsSupplier, themSupplier, suaSupplier, xoaSupplier } from '../../services/SupplierAPI';
import './QL_Supplier.css';

function QL_Supplier() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [form] = Form.useForm();

    // Fetch suppliers from API
    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const data = await layDsSupplier();
            setSuppliers(data.suppliers || []);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            message.error('Không thể tải danh sách nhà cung cấp');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Handle add/edit supplier
    const handleSubmit = async (values) => {
        try {
            if (editingSupplier) {
                // Update supplier
                await suaSupplier({
                    supplier_id: editingSupplier.supplier_id,
                    ...values
                });
                message.success('Cập nhật nhà cung cấp thành công!');
            } else {
                // Add new supplier
                await themSupplier(values);
                message.success('Thêm nhà cung cấp thành công!');
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingSupplier(null);
            fetchSuppliers();
        } catch (error) {
            console.error('Error saving supplier:', error);
            const errorMsg = error.response?.data?.messageInvalid || error.response?.data?.error || 'Có lỗi xảy ra!';
            message.error(errorMsg);
        }
    };

    // Handle delete supplier
    const handleDelete = async (supplierId) => {
        try {
            await xoaSupplier(supplierId);
            message.success('Xóa nhà cung cấp thành công!');
            fetchSuppliers();
        } catch (error) {
            console.error('Error deleting supplier:', error);
            message.error('Có lỗi xảy ra!');
        }
    };

    // Open modal for add/edit
    const openModal = (supplier = null) => {
        if (supplier) {
            setEditingSupplier(supplier);
            form.setFieldsValue(supplier);
        } else {
            setEditingSupplier(null);
            form.resetFields();
            form.setFieldsValue({ is_active: true });
        }
        setIsModalOpen(true);
    };

    // Table columns
    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên nhà cung cấp',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
            sorter: (a, b) => a.supplier_name.localeCompare(b.supplier_name),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 130,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 120,
            align: 'center',
            render: (isActive) => (
                <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? 'Hoạt động' : 'Ngừng'}
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => openModal(record)}
                    />
                    <Popconfirm
                        title="Xóa nhà cung cấp"
                        description="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
                        onConfirm={() => handleDelete(record.supplier_id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="ql-supplier-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Quản lý nhà cung cấp</h2>
                    <p className="page-description">Quản lý thông tin các nhà cung cấp nguyên liệu</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => openModal()}
                >
                    Thêm nhà cung cấp
                </Button>
            </div>

            <div className="table-container">
                <Table
                    columns={columns}
                    dataSource={suppliers}
                    rowKey="supplier_id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} nhà cung cấp`,
                    }}
                />
            </div>

            {/* Add/Edit Modal */}
            <Modal
                title={editingSupplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                    setEditingSupplier(null);
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ is_active: true }}
                >
                    <Form.Item
                        label="Tên nhà cung cấp"
                        name="supplier_name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp!' }]}
                    >
                        <Input placeholder="Nhập tên nhà cung cấp" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="is_active"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng" />
                    </Form.Item>

                    <Form.Item className="form-actions">
                        <Space>
                            <Button onClick={() => {
                                setIsModalOpen(false);
                                form.resetFields();
                                setEditingSupplier(null);
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingSupplier ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default QL_Supplier;

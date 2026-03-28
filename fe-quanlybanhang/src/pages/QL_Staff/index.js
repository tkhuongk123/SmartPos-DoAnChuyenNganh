import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Switch, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import './QL_Staff.css';
import { layDsUser, xoaUser, themUser, suaUser } from '../../services/UserAPI';

const { Option } = Select;

function QL_Staff() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [form] = Form.useForm();

    // Fetch staff from API
    const fetchStaff = async () => {
        setLoading(true);
        try {
            const response = await layDsUser();
            setStaffList(response.users || []);
        } catch (error) {
            console.error('Error fetching staff:', error);
            message.error('Không thể tải danh sách nhân viên');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    // Handle add/edit staff
    const handleSubmit = async (values) => {
        try {
            if (editingStaff) {
                // Update staff
                await suaUser({
                    user_id: editingStaff.user_id,
                    name: values.name,
                    role: values.role,
                    is_active: values.is_active ? 1 : 0
                });
                message.success('Cập nhật nhân viên thành công!');
            } else {
                // Add new staff
                await themUser({
                    name: values.name,
                    username: values.username,
                    password: values.password,
                    role: values.role,
                    is_active: values.is_active ? 1 : 0
                });
                message.success('Thêm nhân viên thành công!');
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingStaff(null);
            fetchStaff();
        } catch (error) {
            console.error('Error saving staff:', error);
            message.error(error.response?.data?.messageInvalid || error.response?.data?.error || 'Có lỗi xảy ra!');
        }
    };

    // Handle delete staff
    const handleDelete = async (userId) => {
        try {
            await xoaUser(userId);
            message.success('Xóa nhân viên thành công!');
            fetchStaff();
        } catch (error) {
            console.error('Error deleting staff:', error);
            message.error('Có lỗi xảy ra!');
        }
    };

    // Open modal for add/edit
    const openModal = (staff = null) => {
        if (staff) {
            setEditingStaff(staff);
            const formData = { ...staff };
            // Don't show password when editing
            delete formData.password;
            form.setFieldsValue(formData);
        } else {
            setEditingStaff(null);
            form.resetFields();
            form.setFieldsValue({ is_active: true, role: 'CASHIER' });
        }
        setIsModalOpen(true);
    };

    // Get role display
    const getRoleDisplay = (role) => {
        const roleMap = {
            MANAGER: { text: 'Quản lý', color: 'purple' },
            CASHIER: { text: 'Thu ngân', color: 'blue' },
            KITCHEN: { text: 'Bếp', color: 'green' }
        };
        return roleMap[role] || { text: role, color: 'default' };
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
            title: 'Họ và tên',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
            width: 150,
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            align: 'center',
            render: (role) => {
                const roleInfo = getRoleDisplay(role);
                return <Tag color={roleInfo.color}>{roleInfo.text}</Tag>;
            },
            filters: [
                { text: 'Quản lý', value: 'MANAGER' },
                { text: 'Thu ngân', value: 'CASHIER' },
                { text: 'Bếp', value: 'KITCHEN' },
            ],
            onFilter: (value, record) => record.role === value,
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
            filters: [
                { text: 'Hoạt động', value: true },
                { text: 'Ngừng', value: false },
            ],
            onFilter: (value, record) => record.is_active === value,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => openModal(record)}
                    />
                    <Popconfirm
                        title="Xóa nhân viên"
                        description="Bạn có chắc chắn muốn xóa nhân viên này?"
                        onConfirm={() => handleDelete(record.user_id)}
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
        <div className="ql-staff-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Quản lý nhân viên</h2>
                    <p className="page-description">Quản lý thông tin tài khoản và phân quyền nhân viên</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => openModal()}
                >
                    Thêm nhân viên
                </Button>
            </div>

            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-icon manager">👨‍💼</div>
                    <div className="stat-content">
                        <div className="stat-value">{staffList.filter(s => s.role === 'MANAGER').length}</div>
                        <div className="stat-label">Quản lý</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon cashier">💰</div>
                    <div className="stat-content">
                        <div className="stat-value">{staffList.filter(s => s.role === 'CASHIER').length}</div>
                        <div className="stat-label">Thu ngân</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon kitchen">👨‍🍳</div>
                    <div className="stat-content">
                        <div className="stat-value">{staffList.filter(s => s.role === 'KITCHEN').length}</div>
                        <div className="stat-label">Bếp</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon total">👥</div>
                    <div className="stat-content">
                        <div className="stat-value">{staffList.length}</div>
                        <div className="stat-label">Tổng nhân viên</div>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <Table
                    columns={columns}
                    dataSource={staffList}
                    rowKey="user_id"
                    loading={loading}
                    scroll={{ x: 1000 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} nhân viên`,
                    }}
                />
            </div>

            {/* Add/Edit Modal */}
            <Modal
                title={editingStaff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                    setEditingStaff(null);
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ is_active: true, role: 'CASHIER' }}
                >
                    <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                            { min: 4, message: 'Tên đăng nhập ít nhất 4 ký tự!' }
                        ]}
                    >
                        <Input
                            placeholder="Nhập tên đăng nhập"
                            disabled={editingStaff !== null}
                        />
                    </Form.Item>

                    {!editingStaff && (
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Nhập mật khẩu"
                            />
                        </Form.Item>
                    )}

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
                        label="Vai trò"
                        name="role"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select placeholder="Chọn vai trò">
                            <Option value="MANAGER">Quản lý</Option>
                            <Option value="CASHIER">Thu ngân</Option>
                            <Option value="KITCHEN">Bếp</Option>
                        </Select>
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
                                setEditingStaff(null);
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingStaff ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default QL_Staff;

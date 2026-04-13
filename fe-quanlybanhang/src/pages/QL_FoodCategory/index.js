// src/pages/QL_FoodCategory/index.js
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { layDsLoaiSanPham, themLoaiSanPham, suaLoaiSanPham, xoaLoaiSanPham } from '../../services/FoodCategoryAPI';
import '../QL_Supplier/QL_Supplier.css';

function QL_FoodCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await layDsLoaiSanPham();
            setCategories(data.data || []); // Phụ thuộc vào response trả về từ backend của bạn
        } catch (error) {
            console.error('Lỗi khi tải danh sách:', error);
            message.error('Không thể tải danh sách loại món ăn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (values) => {
        try {
            if (editingCategory) {
                await suaLoaiSanPham({ food_category_id: editingCategory.food_category_id, ...values });
                message.success('Cập nhật thành công!');
            } else {
                await themLoaiSanPham(values);
                message.success('Thêm mới thành công!');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
    try {
        await xoaLoaiSanPham({ food_category_id: id });
        message.success('Xóa loại món ăn thành công!');
        fetchCategories();
    } catch (error) {
        message.error('Có lỗi xảy ra khi xóa!');
    }
};

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            form.setFieldsValue({
                ...category,
                is_active: category.is_active === 1 || category.is_active === true // Đảm bảo boolean cho Switch
            });
        } else {
            setEditingCategory(null);
            form.resetFields();
            form.setFieldsValue({ is_active: true });
        }
        setIsModalOpen(true);
    };

    const columns = [
        { title: 'STT', key: 'index', width: 60, align: 'center', render: (text, record, index) => index + 1 },
        { title: 'Tên loại món ăn', dataIndex: 'food_category_name', key: 'food_category_name', sorter: (a, b) => a.food_category_name.localeCompare(b.food_category_name) },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Trạng thái', dataIndex: 'is_active', key: 'is_active', width: 120, align: 'center',
            render: (isActive) => (
                <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? 'Hoạt động' : 'Đã ẩn'}
                </span>
            ),
        },
        {
            title: 'Thao tác', key: 'action', width: 120, align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => openModal(record)} />
                    <Popconfirm title="Xóa dữ liệu" description="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.food_category_id)} okText="Xóa" cancelText="Hủy">
                        <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="ql-supplier-container"> {/* Giữ class này nếu bạn lười viết lại CSS, hoặc đổi thành ql-category-container */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">Quản lý loại món ăn</h2>
                    <p className="page-description">Quản lý danh mục phân loại các món ăn</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => openModal()}>Thêm loại món</Button>
            </div>

            <div className="table-container">
                <Table columns={columns} dataSource={categories} rowKey="food_category_id" loading={loading} pagination={{ pageSize: 10 }} />
            </div>

            <Modal title={editingCategory ? 'Sửa loại món ăn' : 'Thêm loại món ăn'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ is_active: true }}>
                    <Form.Item label="Tên loại món" name="food_category_name" rules={[{ required: true, message: 'Vui lòng nhập tên loại!' }]}>
                        <Input placeholder="VD: Món nước, Món nướng..." />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={3} placeholder="Nhập mô tả" />
                    </Form.Item>
                    <Form.Item label="Trạng thái" name="is_active" valuePropName="checked">
                        <Switch checkedChildren="Hoạt động" unCheckedChildren="Đã ẩn" />
                    </Form.Item>
                    <Form.Item className="form-actions">
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">{editingCategory ? 'Cập nhật' : 'Thêm mới'}</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
export default QL_FoodCategory;
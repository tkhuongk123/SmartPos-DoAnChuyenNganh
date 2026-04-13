import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// Đảm bảo đường dẫn import API chính xác với cấu trúc thư mục của bạn
import { layDsIngredient, createIngredient, updateIngredient, deleteIngredient } from '../../services/IngredientAPI';
import '../QL_Supplier/QL_Supplier.css'; 

function QL_Ingredient() {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [form] = Form.useForm();

    const fetchIngredients = async () => {
        setLoading(true);
        try {
            const res = await layDsIngredient();
            setIngredients(res.ingredients || res.data || []); 
        } catch (error) {
            console.error(error);
            message.error('Không thể tải danh sách nguyên liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    const handleSubmit = async (values) => {
        try {
            if (editingIngredient) {
                await updateIngredient(editingIngredient.ingredient_id, values);
                message.success('Cập nhật nguyên liệu thành công!');
            } else {
                await createIngredient(values);
                message.success('Thêm nguyên liệu thành công!');
            }
            setIsModalOpen(false);
            fetchIngredients();
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra khi lưu thông tin!');
        }
    };

    const handleEdit = (record) => {
        setEditingIngredient(record);
        form.setFieldsValue({
            ingredient_name: record.ingredient_name,
            unit: record.unit,
            stock_quantity: record.stock_quantity,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteIngredient(id);
            message.success('Xóa nguyên liệu thành công!');
            fetchIngredients();
        } catch (error) {
            console.error(error);
            message.error('Không thể xóa nguyên liệu này!');
        }
    };

    const openAddNew = () => {
        setEditingIngredient(null);
        form.resetFields();
        form.setFieldsValue({ stock_quantity: 0 }); 
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'ingredient_id',
            key: 'ingredient_id',
            width: '10%',
            align: 'center'
        },
        {
            title: 'Tên Nguyên Liệu',
            dataIndex: 'ingredient_name',
            key: 'ingredient_name',
        },
        {
            title: 'Đơn vị tính',
            dataIndex: 'unit',
            key: 'unit',
            align: 'center'
        },
        {
            title: 'Số lượng tồn',
            dataIndex: 'stock_quantity',
            key: 'stock_quantity',
            align: 'center'
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa nguyên liệu"
                        description={`Bạn có chắc chắn muốn xóa ${record.ingredient_name} không?`}
                        onConfirm={() => handleDelete(record.ingredient_id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="supplier-container">
            <div className="header-actions">
                <h2>Quản Lý Nguyên Liệu</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={openAddNew}>
                    Thêm Nguyên Liệu
                </Button>
            </div>

            <div className="table-container">
                <Table 
                    columns={columns} 
                    dataSource={ingredients} 
                    rowKey="ingredient_id" 
                    loading={loading} 
                    pagination={{ pageSize: 10 }} 
                />
            </div>

            <Modal 
                title={editingIngredient ? 'Sửa thông tin nguyên liệu' : 'Thêm nguyên liệu mới'} 
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)} 
                footer={null}
            >
                <Form 
                    form={form} 
                    layout="vertical" 
                    onFinish={handleSubmit}
                >
                    <Form.Item 
                        label="Tên nguyên liệu" 
                        name="ingredient_name" 
                        rules={[{ required: true, message: 'Vui lòng nhập tên nguyên liệu!' }]}
                    >
                        <Input placeholder="VD: Gạo, Bột mì, Cà phê..." />
                    </Form.Item>

                    <Form.Item 
                        label="Đơn vị tính" 
                        name="unit" 
                        rules={[{ required: true, message: 'Vui lòng nhập đơn vị tính!' }]}
                    >
                        <Input placeholder="VD: kg, gram, lít, cái..." />
                    </Form.Item>

                    <Form.Item 
                        label="Số lượng tồn kho" 
                        name="stock_quantity" 
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                    >
                        <InputNumber 
                            style={{ width: '100%' }} 
                            min={0} 
                            step={0.01}
                            placeholder="Nhập số lượng..." 
                        />
                    </Form.Item>

                    <Form.Item className="form-actions" style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">
                                {editingIngredient ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default QL_Ingredient;
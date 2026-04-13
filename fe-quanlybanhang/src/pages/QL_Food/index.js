import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { layDsSanPham, createFood, updateFood, deleteFood, laySanPhamTheoId } from '../../services/FoodAPI';
import { layDs } from '../../services/FoodCategoryAPI';
import { api } from '../../services/config';
import '../QL_Supplier/QL_Supplier.css';



const { Option } = Select;

function QL_Food() {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFoodId, setEditingFoodId] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [foodRes, catRes] = await Promise.all([layDsSanPham(), layDs()]);
            setFoods(foodRes.dsSanPham || []);
            setCategories(catRes.data || []);
        } catch (error) {
            message.error('Lỗi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleEdit = async (record) => {
        try {
            const res = await laySanPhamTheoId({ food_id: record.food_id });
            const foodData = res.data;
            
            setEditingFoodId(foodData.food_id);
            setImageUrl(foodData.image);
            form.setFieldsValue(foodData);
            setIsModalOpen(true);
        } catch (error) {
            message.error('Không thể lấy thông tin chi tiết món ăn');
        }
    };

    const handleUpload = (info) => {
        if (info.file.status === 'done') {
            const url = info.file.response.url;
            const fileName = url.replace('/images/', '');
            setImageUrl(fileName);
            message.success('Tải ảnh thành công');
        } else if (info.file.status === 'error') {
            message.error('Tải ảnh thất bại');
        }
    };

    const handleSubmit = async (values) => {
        const payload = { ...values, image: imageUrl };
        try {
            if (editingFoodId) {
                await updateFood(editingFoodId, payload);
                message.success('Cập nhật thành công');
            } else {
                await createFood(payload);
                message.success('Thêm món mới thành công');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            message.error('Lỗi lưu dữ liệu');
        }
    };

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (img) => <img src={`${api}/uploads/ProductImages/${img}`} alt="food" style={{ width: 50, borderRadius: 4 }} />,
        },
        { title: 'Tên món', dataIndex: 'food_name', key: 'food_name' },
        { title: 'Loại món', dataIndex: 'food_category_name', key: 'food_category_name' },
        { title: 'Giá', dataIndex: 'price', render: (p) => `${p?.toLocaleString()}đ` },
        { 
            title: 'Thao tác', 
            key: 'action', 
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm title="Xóa món ăn này?" onConfirm={() => deleteFood(record.food_id).then(fetchData)}>
                        <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ) 
        },
    ];

    return (
        <div className="supplier-container">
            <div className="header-actions">
                <h2>Quản Lý Món Ăn</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditingFoodId(null);
                    setImageUrl('');
                    form.resetFields();
                    setIsModalOpen(true);
                }}>Thêm Món</Button>
            </div>

            <Table columns={columns} dataSource={foods} rowKey="food_id" loading={loading} />

            <Modal title={editingFoodId ? 'Sửa món ăn' : 'Thêm món ăn'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="food_name" label="Tên món ăn" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="food_category_id" label="Loại món" rules={[{ required: true }]}>
                        <Select placeholder="Chọn loại món">
                            {categories.map(cat => <Option key={cat.food_category_id} value={cat.food_category_id}>{cat.food_category_name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="price" label="Giá bán" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item name="food_status" label="Trạng thái" initialValue="AVAILABLE">
                        <Select>
                            <Option value="AVAILABLE">Còn món</Option>
                            <Option value="SOLD OUT">Hết món</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Hình ảnh">
                        <Upload 
                            action={`${api}/sanpham/uploadImage?folder=ProductImages`}
                            name="file"
                            maxCount={1}
                            onChange={handleUpload}
                        >
                            <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                        </Upload>
                        {imageUrl && <img src={`${api}/uploads/ProductImages/${imageUrl}`} alt="preview" style={{ width: 100, marginTop: 10 }} />}
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Lưu</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default QL_Food;
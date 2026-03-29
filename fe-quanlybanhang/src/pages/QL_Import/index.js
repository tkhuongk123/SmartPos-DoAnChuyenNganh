import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, InputNumber, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { layDsSupplier } from '../../services/SupplierAPI';
import { layDsIngredient } from '../../services/IngredientAPI';
import { layDsImport, layImport, taoPhieuNhap } from '../../services/ImportAPI';
import './QL_Import.css';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

function QL_Import() {
    const [imports, setImports] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedImport, setSelectedImport] = useState(null);
    const [form] = Form.useForm();
    const [importItems, setImportItems] = useState([]);

    // Get current user from sessionStorage
    const getCurrentUser = () => {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.user_id;
            } catch (error) {
                console.error('Error parsing user from sessionStorage:', error);
                return null;
            }
        }
        return null;
    };

    // Fetch data
    const fetchImports = async () => {
        setLoading(true);
        try {
            const response = await layDsImport();
            setImports(response.imports || []);
        } catch (error) {
            console.error('Error fetching imports:', error);
            message.error('Không thể tải danh sách phiếu nhập');
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await layDsSupplier();
            setSuppliers(response.suppliers || []);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            message.error('Không thể tải danh sách nhà cung cấp');
        }
    };

    const fetchIngredients = async () => {
        try {
            const response = await layDsIngredient();
            setIngredients(response.ingredients || []);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            message.error('Không thể tải danh sách nguyên liệu');
        }
    };

    useEffect(() => {
        fetchImports();
        fetchSuppliers();
        fetchIngredients();
    }, []);

    // Handle create import
    const handleSubmit = async (values) => {
        if (importItems.length === 0) {
            message.error('Vui lòng thêm ít nhất một nguyên liệu!');
            return;
        }

        const currentUserId = getCurrentUser();
        if (!currentUserId) {
            message.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!');
            return;
        }

        try {
            await taoPhieuNhap({
                supplier_id: values.supplier_id,
                created_by: currentUserId,
                note: values.note || '',
                items: importItems
            });

            message.success('Tạo phiếu nhập thành công!');
            setIsModalOpen(false);
            form.resetFields();
            setImportItems([]);
            fetchImports();
        } catch (error) {
            console.error('Error creating import:', error);
            message.error(error.response?.data?.error || 'Có lỗi xảy ra!');
        }
    };

    // Add item to import list
    const handleAddItem = () => {
        const ingredient_id = Number(form.getFieldValue('ingredient_id'));
        const quantity = Number(form.getFieldValue('quantity'));
        const price = Number(form.getFieldValue('price'));

        if (!ingredient_id || quantity <= 0 || price <= 0) {
            message.warning('Vui lòng chọn nguyên liệu và nhập số lượng, đơn giá lớn hơn 0!');
            return;
        }

        const ingredient = ingredients.find(i => Number(i.ingredient_id) === ingredient_id);
        if (!ingredient) {
            message.error('Không tìm thấy nguyên liệu!');
            return;
        }

        const newItem = {
            ingredient_id,
            ingredient_name: ingredient.ingredient_name,
            unit: ingredient.unit,
            quantity,
            price,
            subtotal: quantity * price
        };

        setImportItems([...importItems, newItem]);

        // Reset item fields
        form.setFieldsValue({
            ingredient_id: undefined,
            quantity: 1,
            price: 0
        });

        message.success('Đã thêm nguyên liệu vào danh sách');
    };

    // Remove item from list
    const handleRemoveItem = (index) => {
        const newItems = importItems.filter((_, i) => i !== index);
        setImportItems(newItems);
    };

    // Open detail modal
    const openDetailModal = async (record) => {
        try {
            const response = await layImport(record.receipt_id);
            setSelectedImport(response.import);
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error('Error loading import details:', error);
            message.error('Không thể tải chi tiết phiếu nhập');
        }
    };

    // Open create modal
    const openCreateModal = () => {
        form.resetFields();
        form.setFieldsValue({
            quantity: 1,
            price: 0
        });
        setImportItems([]);
        setIsModalOpen(true);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Table columns
    const columns = [
        {
            title: 'Mã phiếu',
            dataIndex: 'receipt_id',
            key: 'receipt_id',
            width: 100,
            align: 'center',
            render: (id) => <Tag color="blue">PNH{String(id).padStart(4, '0')}</Tag>
        },
        {
            title: 'Ngày nhập',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Nhà cung cấp',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total_amount',
            key: 'total_amount',
            width: 150,
            align: 'right',
            sorter: (a, b) => a.total_amount - b.total_amount,
            render: (amount) => <span style={{ fontWeight: 600, color: '#1890ff' }}>{formatCurrency(amount)}</span>
        },
        {
            title: 'Người tạo',
            dataIndex: 'created_by_name',
            key: 'created_by_name',
            width: 120,
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            ellipsis: true,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 80,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => openDetailModal(record)}
                    />
                </Space>
            ),
        },
    ];

    // Import items columns
    const itemColumns = [
        {
            title: 'Tên nguyên liệu',
            dataIndex: 'ingredient_name',
            key: 'ingredient_name',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            align: 'center',
            render: (qty, record) => `${qty} ${record.unit}`
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            align: 'right',
            render: (price) => formatCurrency(price)
        },
        {
            title: 'Thành tiền',
            dataIndex: 'subtotal',
            key: 'subtotal',
            width: 150,
            align: 'right',
            render: (subtotal) => <span style={{ fontWeight: 600, color: '#52c41a' }}>{formatCurrency(subtotal)}</span>
        },
        {
            title: '',
            key: 'action',
            width: 60,
            render: (_, record, index) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleRemoveItem(index)}
                />
            ),
        },
    ];

    return (
        <div className="ql-import-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Quản lý nhập hàng</h2>
                    <p className="page-description">Quản lý phiếu nhập hàng và nguyên liệu</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={openCreateModal}
                >
                    Tạo phiếu nhập
                </Button>
            </div>

            <div className="table-container">
                <Table
                    columns={columns}
                    dataSource={imports}
                    rowKey="receipt_id"
                    loading={loading}
                    scroll={{ x: 1000 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} phiếu nhập`,
                    }}
                />
            </div>

            {/* Create Import Modal */}
            <Modal
                title="Tạo phiếu nhập hàng"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                    setImportItems([]);
                }}
                footer={null}
                width={900}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        quantity: 1,
                        price: 0
                    }}
                >
                    <Form.Item
                        label="Nhà cung cấp"
                        name="supplier_id"
                        rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp!' }]}
                    >
                        <Select placeholder="Chọn nhà cung cấp" size="large">
                            {suppliers.filter(s => Number(s.is_active) === 1).map(supplier => (
                                <Option key={supplier.supplier_id} value={supplier.supplier_id}>
                                    {supplier.supplier_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ghi chú"
                        name="note"
                    >
                        <TextArea rows={2} placeholder="Nhập ghi chú (không bắt buộc)" />
                    </Form.Item>

                    <div className="import-section-divider">Thông tin nguyên liệu</div>

                    <div className="form-row">
                        <Form.Item
                            label="Nguyên liệu"
                            name="ingredient_id"
                            style={{ flex: 2 }}
                        >
                            <Select
                                placeholder="Chọn nguyên liệu"
                                showSearch
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    option?.label?.toString().toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {ingredients.filter(i => Number(i.is_active) === 1).map(ingredient => (
                                    <Option
                                        key={ingredient.ingredient_id}
                                        value={Number(ingredient.ingredient_id)}
                                        label={`${ingredient.ingredient_name} (${ingredient.unit})`}
                                    >
                                        {ingredient.ingredient_name} ({ingredient.unit})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Số lượng"
                            name="quantity"
                            style={{ flex: 1 }}
                        >
                            <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Đơn giá"
                            name="price"
                            style={{ flex: 1 }}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </div>

                    <Button
                        type="dashed"
                        onClick={handleAddItem}
                        block
                        icon={<PlusOutlined />}
                        style={{ marginTop: 8, marginBottom: 16 }}
                    >
                        Thêm nguyên liệu
                    </Button>

                    {importItems.length > 0 && (
                        <div className="import-items-table">
                            <Table
                                columns={itemColumns}
                                dataSource={importItems}
                                pagination={false}
                                size="small"
                                rowKey={(record, index) => index}
                                summary={() => (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3}>
                                                <strong>Tổng cộng</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1} align="right">
                                                <strong style={{ color: '#1890ff', fontSize: 16 }}>
                                                    {formatCurrency(importItems.reduce((sum, item) => sum + item.subtotal, 0))}
                                                </strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2} />
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )}
                            />
                        </div>
                    )}

                    <Form.Item className="form-actions">
                        <Space>
                            <Button onClick={() => {
                                setIsModalOpen(false);
                                form.resetFields();
                                setImportItems([]);
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Tạo phiếu nhập
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                title={`Chi tiết phiếu nhập - PNH${String(selectedImport?.receipt_id).padStart(4, '0')}`}
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
                        Đóng
                    </Button>
                ]}
                width={800}
            >
                {selectedImport && (
                    <div className="import-detail">
                        <div className="detail-info">
                            <div className="info-item">
                                <span className="label">Nhà cung cấp:</span>
                                <span className="value">{selectedImport.supplier_name}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Ngày nhập:</span>
                                <span className="value">{dayjs(selectedImport.created_at).format('DD/MM/YYYY HH:mm')}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Người tạo:</span>
                                <span className="value">{selectedImport.created_by_name}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Ghi chú:</span>
                                <span className="value">{selectedImport.note || 'Không có ghi chú'}</span>
                            </div>
                        </div>

                        <div className="import-section-divider">Danh sách nguyên liệu</div>

                        <Table
                            columns={itemColumns.filter(col => col.key !== 'action')}
                            dataSource={selectedImport.items}
                            pagination={false}
                            size="small"
                            rowKey={(record, index) => index}
                            summary={() => (
                                <Table.Summary fixed>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3}>
                                            <strong>Tổng cộng</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} align="right">
                                            <strong style={{ color: '#1890ff', fontSize: 16 }}>
                                                {formatCurrency(selectedImport.total_amount)}
                                            </strong>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>
                            )}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default QL_Import;

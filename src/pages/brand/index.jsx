import { useEffect, useState } from "react";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import { brand, category } from "@service";
import { BrandModal, GlobalTable } from "@components";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined} from "@ant-design/icons";
const Index = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [total, setTotal] = useState()
  const [params, setParams] = useState({
    search: "",
    page: 1,
    limit: 3,
  });

  const handleClose = () => {
    setOpen(false);
    setEditingBrand(null);
  };

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setParams((prev) => ({
      ...prev,
      limit: pageSize,
      page: current,
    }));
    fetchBrands();
  };

  const fetchBrands = async () => {
    try {
      const res = await brand.get(params); 
      setData(res?.data?.data?.brands);
      setTotal(res?.data?.data?.count);
    } catch (error) {
      console.log("error");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await category.get();
      setCategories(res?.data?.data?.categories);
      
      console.log(res?.data?.data?.count, 'count');
      
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const handleSubmit = async (brandData) => {
    try {
      console.log("Submitting brand data:", brandData);
      if (editingBrand) {
        await brand.update(editingBrand.id, brandData);
      } else {
        await brand.create(brandData);
      }
      fetchBrands();
      handleClose();
    } catch (error) {
      console.log("Error submitting brand:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingBrand(item);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await brand.delete(id);
      fetchBrands();
    } catch (error) {
      console.log("Error deleting brand:", error);
    }
  };

  const handleCreate = () => {
    setEditingBrand(null);
    setOpen(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Category ID",
      dataIndex: "category_id",
    },
    {
      title: "File",
      dataIndex: "file",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Tooltip>
            <Button
              onClick={() => handleEdit(record)}
              variant="solid"
              color="danger"
              style={{ marginRight: "8px", backgroundColor: "#ffcc55" }}
              icon={<EditOutlined />}
            />
          </Tooltip>

          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip>
              <Button
                danger
                color="danger"
                variant="solid"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <BrandModal
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        editingBrand={editingBrand}
        categories={categories}
      />
      <Button
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: "10px" }}
      >
        Create Brand
      </Button>
      <GlobalTable
        columns={columns}
        data={data}
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["2", "5", "7", "10", "12"],
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Index;

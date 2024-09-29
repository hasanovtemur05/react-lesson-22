import { useEffect, useState, navigate } from "react";
import { Button, Popconfirm, Space, Tooltip, Form, Input } from "antd";
import { brand, category } from "@service";
import { BrandModal, GlobalTable } from "@components";
import { DeleteOutlined, EditOutlined} from "@ant-design/icons";
const Index = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm()
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
    getData();
  };

  const getData = async () => {
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
    getData();
    fetchCategories();
  }, []);

  const handleSubmit = async (brandData) => {
    console.log(brandData);
    
    try {
      console.log("Submitting brand data:", brandData);
      if (editingBrand) {
        await brand.update(editingBrand.id, brandData);
      } else {
        await brand.create(brandData);
      }
      getData();
      handleClose();
    } catch (error) {
      console.log("Error submitting brand:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await brand.delete(id);
      getData();
    } catch (error) {
      console.log("Error deleting brand:", error);
    }
  };

  const handleCreate = () => {
    setEditingBrand(null);
    setOpen(true);
  };

  const handleChange = (event) =>{
    console.log(event.target.value);
    
    setParams((prev)=>({
      ...prev,
      search: event.target.value,
    }))
    const search_params = new URLSearchParams(search)
    search_params.set("search", event.target.value)
    
    navigate(`?${search_params}`)
  }

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
              onClick={() => {
                setEditingBrand(record);
                setOpen(true)
              }  }
              variant="solid"
              color="danger"
              style={{ marginRight: "8px", backgroundColor: "#ffcc55" }}
              icon={<EditOutlined />}
            />
          </Tooltip>

          <Popconfirm
            title="Delete"
            description="O'chirmoqchimisiz"
            okText="ha"
            cancelText="yoq"
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
        getData={getData}
        editingBrand={editingBrand}
        categories={categories}
      />
      <div>
        <Input placeholder="search..." className="w-[300px]" onChange={handleChange} />
      <Button
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: "10px" }}
      >
        Create Brand
      </Button>
      </div>
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

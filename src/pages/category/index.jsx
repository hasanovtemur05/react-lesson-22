import React, { useEffect, useState,navigate } from "react";
import { Button, Popconfirm, Space, Tooltip, Form ,Input} from "antd";
import { category } from "@service";
import { GlobalTable } from "@components";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Category } from "@modals";
import { CategoryModal } from "@components";
const Index = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState()
  const [form] = Form.useForm()
  const [editingCategory, setEditingCategory] = useState([]);
  const [params, setParams] = useState({
    search: "",
    page: 1,
    limit: 3,
  });

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
  };

  const getData = async () => {
  try {
    const res = await category.get(params);
    setData(res?.data?.data?.categories);
    setTotal(res?.data?.data?.count);
  } catch (error) {
    console.log('error');
  }
};


  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setParams((prev) => ({
      ...prev,
      page: current,
      limit: pageSize,
    }));
    console.log(pagination);
    getData();
  };

 

  useEffect(() => {
    getData();
  }, [params]);

  const handleSubmit = async (categoryData) => {
    try {
      if (editingCategory) {
        await category.update(editingCategory.id, categoryData);
      } else {
        await category.create(categoryData);
      }
      getData(); 
      handleClose(); 
    } catch (error) {
      console.log("Error submitting category:", error);
    }
  };

  const editItem = async (item) => {
    try {
      if (editingCategory) {
        await category.update(editingCategory.id, item)
      }else{
        await category.create(item)
      }
      getData()
      setOpen(false)
      form.resetFields()
      
    } catch (error) {
      console.log('error');
    }
    setEditingCategory(item);
    setOpen(true);
  };

  const deleteItem = async (id) => {
    try {
      await category.delete(id);
      getData();
    } catch (error) {
      console.log("Error deleting category:", error);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setOpen(true);
  };

  const handleChange = (event) => {
    setParams((prev)=>({
      ...prev,
      search: event.target.value
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              onClick={() => editItem(record)}
              style={{ marginRight: "8px", backgroundColor: "#ffcc55" }}
              variant="solid"
              color="danger"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteItem(record.id)}
          >
            <Tooltip title="Delete">
              <Button
                danger
                variant="solid"
                color="danger"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
          </Space>
      ),
    },
  ];
 

  return (
    <>
    <CategoryModal
      open={open}
      handleClose={handleClose}
      handleSubmit={handleSubmit}
      editingCategory={editingCategory}
    />
      <div className="flex justify-between items-center my-3">
        <Input placeholder="search..." className="w-[300px]" onChange={handleChange} />
      <Button
        type="primary"
        onClick={handleCreate}
        
      >
        Create Category
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
    </>
  );
};

export default Index;

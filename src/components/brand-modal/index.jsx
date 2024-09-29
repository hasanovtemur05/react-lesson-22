import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Upload, message } from 'antd';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { brand } from '@service';

const { Option } = Select;

const brandValidationSchema = Yup.object().shape({
  name: Yup.string().required("Brand Name is required"),
  description: Yup.string().required("Description is required"),
  category_id: Yup.number().required("Category ID is required").typeError("Category ID must be a number"),
  file: Yup.mixed(),
});

const BrandModal = ({ open, handleClose, editingBrand, categories, getData }) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    category_id: "",
    file: null,
  });

  useEffect(() => {
    if (open && editingBrand) {
      setInitialValues({
        name: editingBrand.name || "",
        description: editingBrand.description || "",
        category_id: editingBrand.category_id || "",
        file: null,
      });
    } else {
      setInitialValues({ name: "", description: "", category_id: "", file: null });
    }
  }, [open, editingBrand]);

  const onSubmit = async (values) => {
    console.log("Form values:", values); 
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category_id", values.category_id);
      formData.append("file", values.file);

      if (editingBrand) {
        await brand.update(editingBrand.id, formData);
      } else {
        await brand.create(formData);
      }
      getData();
      handleClose();
      message.success("Brand saved successfully!"); 
    } catch (error) {
      console.error("Error submitting brand:", error); 
      message.error("Error submitting brand");
    }
  };

  return (
    <Modal
      title={editingBrand?.id ? "Edit Brand" : "Add Brand"}
      visible={open}
      onCancel={handleClose}
      footer={null}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={brandValidationSchema}
        onSubmit={onSubmit}
      >
        {({ values, isSubmitting, setFieldValue, handleChange, handleSubmit }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Brand Name">
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
              />
              <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
            </Form.Item>

            <Form.Item label="Description">
              <Input.TextArea
                name="description"
                rows={2}
                value={values.description}
                onChange={handleChange}
                style={{resize:"none"}}
              />
              <ErrorMessage name="description" component="div" style={{ color: 'red' }} />
            </Form.Item>

            <Form.Item label="Category">
              <Select
                name="category_id"
                value={values.category_id}
                onChange={(value) => setFieldValue("category_id", value)}
                placeholder="Select Category"
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
              <ErrorMessage name="category_id" component="div" style={{ color: 'red' }} />
            </Form.Item>

            <Form.Item label="Upload File">
              <Upload
                beforeUpload={(file) => {
                  setFieldValue("file", file);
                  return false; 
                }}
                showUploadList={false}
              >
                <Button>Click to Upload</Button>
              </Upload>
              {values.file && <span>{values.file.name}</span>}
              <ErrorMessage name="file" component="div" style={{ color: 'red' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                {editingBrand?.id ? "Update" : "Create"}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default BrandModal;

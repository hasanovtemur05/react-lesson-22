import { Modal, Typography, Input, Button, Form, message } from "antd";
import { useState, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

const categoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Category Name is required"),
});

export default function CategoryModal({
  open,
  handleClose,
  handleSubmit,
  editingCategory,
}) {
  const [initialValues, setInitialValues] = useState({ name: "" });

  useEffect(() => {
    if (open && editingCategory) {
      setInitialValues({ name: editingCategory?.name || "" });
    } else {
      setInitialValues({ name: "" });
    }
  }, [open, editingCategory]);

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await handleSubmit(values);
      handleClose();
      message.success("Category saved successfully!");
    } catch (error) {
      console.log("Error in submission:", error);
      message.error("Error saving category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={editingCategory?.id ? "Edit Category" : "Add Category"}
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={categoryValidationSchema}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Category Name">
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter category name"
              />
              <ErrorMessage
                name="name"
                component="div"
                style={{ color: "red", fontSize: "13px" }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                block
              >
                {editingCategory?.id ? "Update" : "Save"}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

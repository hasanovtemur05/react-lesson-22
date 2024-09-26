import React from "react";
import { Formik, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import * as Yup from "yup";
import axios from "axios";

const signUpValidationSchema = Yup.object().shape({
  first_name: Yup.string().required("Please input your first name!"),
  last_name: Yup.string().required("Please input your last name!"),
  phone_number: Yup.string().required("Please input your phone number!"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Please input your email!"),
  password: Yup.string().required("Please input your password!"),
});

const Index = () => {
  const navigate = useNavigate();

  const initialValues = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "https://texnoark.ilyosbekdev.uz/auth/admin/sign-up",
        values
      );
      if (response.status === 201) {
        message.success("Sign-up successful!");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      message.error("Sign-up failed. Please try again.");
    }
  };

  return (
    <div style={{ margin: "auto", marginTop: "50px" }} className="max-w-64 lg:max-w-[450px]">
      <Formik
        initialValues={initialValues}
        validationSchema={signUpValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleSubmit, setFieldValue }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="First Name"
              validateStatus={errors.first_name && touched.first_name ? "error" : ""}
              help={errors.first_name && touched.first_name ? errors.first_name : ""}
            >
              <Field name="first_name">
                {({ field }) => <Input {...field} placeholder="First Name" />}
              </Field>
            </Form.Item>

            <Form.Item
              label="Last Name"
              validateStatus={errors.last_name && touched.last_name ? "error" : ""}
              help={errors.last_name && touched.last_name ? errors.last_name : ""}
            >
              <Field name="last_name">
                {({ field }) => <Input {...field} placeholder="Last Name" />}
              </Field>
            </Form.Item>

            <Form.Item
              label="Phone Number"
              validateStatus={errors.phone_number && touched.phone_number ? "error" : ""}
              help={errors.phone_number && touched.phone_number ? errors.phone_number : ""}
            >
              <Field name="phone_number">
                {({ field }) => <Input {...field} placeholder="Phone Number" />}
              </Field>
            </Form.Item>

            <Form.Item
              label="Email"
              validateStatus={errors.email && touched.email ? "error" : ""}
              help={errors.email && touched.email ? errors.email : ""}
            >
              <Field name="email">
                {({ field }) => <Input {...field} placeholder="Email" />}
              </Field>
            </Form.Item>

            <Form.Item
              label="Password"
              validateStatus={errors.password && touched.password ? "error" : ""}
              help={errors.password && touched.password ? errors.password : ""}
            >
              <Field name="password">
                {({ field }) => <Input.Password {...field} placeholder="Password" />}
              </Field>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Save
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Index;

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const categoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Category Name is required")
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CategoryModal({ open, handleClose, handleSubmit, editingCategory }) {
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
    } catch (error) {
      console.log("Error in submission:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography align="center" variant="h6">
          {editingCategory?.id ? "Edit Category" : "Add Category"}
        </Typography>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={categoryValidationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                name="name"
                as={TextField}
                fullWidth
                label="Category Name"
                helperText={<ErrorMessage name="name" component="div" className="text-red-600 text-[15px]" />}
                sx={{ marginY: "15px" }}
              />
              <Button variant="contained" color="success" type="submit" disabled={isSubmitting} fullWidth>
                {editingCategory?.id ? "Update" : "Save"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}

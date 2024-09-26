import https from "./config";

const SubCategory = {
  create: (data) => https.post("/sub-category/create", data),
  get: () => https.get(`/sub-category/search/${parent_category_id}`),
  update: (id, data) => https.patch(`/sub-category/update/${id}`, data),
  delete: (id) => https.delete(`/sub-category/delete/${id}`)
};

export default SubCategory;
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
  } from "react-router-dom";
  
  import App from "../App";
  import { SignIn, AdminLayout, SignUp, Category, Brand, SubCategory } from "@pages";
  
  const Index = () => {
    const router = createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<App />}>
          <Route index element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          {/* Admin */}
          <Route path="admin-layout" element={<AdminLayout />}>
            <Route index element={<Category />} />
            <Route path="brand" element={<Brand />} />
            <Route path="sub-category" element={<SubCategory/>} />
          </Route>
        </Route>
      )
    );
  
    return <RouterProvider router={router} />;
  };
  
  export default Index;
  
import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, NavLink } from "react-router-dom";
import { admin } from "../../router/routs";
import logo from "../../assets/images/logo.png"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Layout, Menu, Button, Avatar, Dropdown, message, theme } from "antd";

const Index = () => {
  const { Header, Sider, Content } = Layout;
  const [selectedKeys, setSelectedKeys] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    let index = admin.findIndex((item) => item.path === pathname);
    if (index !== -1) {
      setSelectedKeys(index.toString());
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    message.success("Logged out successfully");
    navigate("/");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="2" icon={<VideoCameraOutlined />}>
        Dashboard
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }} >
      <Sider trigger={null} collapsible collapsed={collapsed}>

        <div className="w-[80%]  h-auto m-[10px]" >
          <img src={logo} alt="logo" />
          </div>


        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          selectedKeys={[selectedKeys]}
          items={admin.map((item, index) => ({
            key: index.toString(),
            icon: item.icon,
            label: (
              <NavLink to={item.path} className="text-white">
                {item.content}
              </NavLink>
            ),
          }))}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding:"0px 20px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems:"center"
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
          <Dropdown overlay={userMenu} placement="bottomRight" arrow>
            <Avatar style={{ marginRight: "16px" }} icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Index;

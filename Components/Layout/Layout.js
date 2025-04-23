import React from "react";
import { Layout as AntLayout, Menu, Breadcrumb } from "antd";
import { useRouter } from "next/router";
import projects from "../Proejct/projects";

const { Header, Content, Sider } = AntLayout;

function Layout({ children }) {
  const router = useRouter();
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}></Menu>
      </Header>
      <AntLayout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item
              key="/"
              onClick={() => {
                router.push("/");
              }}
            >
              Dashboard
            </Menu.Item>
            <Menu.Item
              key="users"
              onClick={() => {
                router.push("/users");
              }}
            >
              Users
            </Menu.Item>
          </Menu>
        </Sider>
        <AntLayout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
}

export default Layout;

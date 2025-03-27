import LogoutOutlined from '@ant-design/icons/lib/icons/LogoutOutlined'
import ReadOutlined from '@ant-design/icons/lib/icons/ReadOutlined'
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined'
import { Logo } from '@assets/images'
import { Layout as AntdLayout, Menu } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import SharedHeader from '../Header/SharedHeader'

const { Sider, Content } = AntdLayout

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <AntdLayout className="min-h-screen">
      <Sider className="bg-primary-color" width={250} collapsed={collapsed} trigger={null} collapsible>
        <div className="mb-8 ml-1 mt-4">
          <img className="w-[180px]" src={Logo} alt="Logo" />
        </div>
        <Menu
          className="bg-primary-color custom-sidebar-menu"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>
            },
            {
              key: '2',
              icon: <ReadOutlined />,
              label: 'Classes'
            },
            {
              type: 'divider',
              style: { borderColor: 'rgba(255, 255, 255, 0.15)', margin: '16px 0' }
            },
            {
              key: '3',
              icon: <LogoutOutlined />,
              label: 'Sign out',
              style: {
                backgroundColor: '#ff4d4f',
                color: 'white'
              }
            }
          ]}
        />
      </Sider>
      <AntdLayout>
        <SharedHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="m-4 bg-white p-4">{children}</Content>
      </AntdLayout>
    </AntdLayout>
  )
}

export default Layout

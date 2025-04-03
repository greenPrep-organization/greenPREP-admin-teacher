import LogoutOutlined from '@ant-design/icons/lib/icons/LogoutOutlined'
import ReadOutlined from '@ant-design/icons/lib/icons/ReadOutlined'
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined'
import { Logo } from '@assets/images'
import { Layout as AntdLayout, Menu } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SharedHeader from '../Header/SharedHeader'

import LogoutModal from '@pages/LogoutModal'
const { Sider, Content } = AntdLayout
const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const location = useLocation()
  const [selectedKey, setSelectedKey] = useState('1')

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setSelectedKey('1')
        break
      case '/classes-management':
        setSelectedKey('2')
        break
      default:
        setSelectedKey('1')
    }
  }, [location.pathname])

  return (
    <AntdLayout className="min-h-screen">
      <Sider className="bg-primary-color" width={250} collapsed={collapsed} trigger={null} collapsible>
        <div className="mb-8 ml-1 mt-4">
          <img className="w-[180px]" src={Logo} alt="Logo" />
        </div>
        <Menu
          className="bg-primary-color custom-sidebar-menu"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: <Link to="/">Dashboard</Link>
            },
            {
              key: '2',
              icon: <ReadOutlined />,
              label: <Link to="/classes-management">Classes</Link>
            },
            {
              type: 'divider',
              style: { borderColor: 'rgba(255, 255, 255, 0.15)', margin: '16px 0' }
            },
            {
              key: '3',
              icon: <LogoutOutlined />,
              label: 'Sign out',
              onClick: () => setIsLogoutModalOpen(true),
              style: {
                backgroundColor: '#FF4D4F',
                color: 'white'
              }
            }
          ]}
        />
      </Sider>
      <AntdLayout>
        <SharedHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
        />
        <Content className="m-4 bg-white p-4">{children}</Content>
      </AntdLayout>

      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </AntdLayout>
  )
}
export default Layout

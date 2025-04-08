import LogoutOutlined from '@ant-design/icons/lib/icons/LogoutOutlined'
import ReadOutlined from '@ant-design/icons/lib/icons/ReadOutlined'
import TeamOutlined from '@ant-design/icons/lib/icons/TeamOutlined'
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined'
import { Logo } from '@assets/images'
import LogoutModal from '@pages/LogoutModal'
import { Layout as AntdLayout, Menu } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import SharedHeader from '../Header/SharedHeader'

const { Sider, Content } = AntdLayout

const Layout = ({ children }) => {
  // @ts-ignore
  const auth = useSelector(state => state.auth)
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
      case '/admin':
        setSelectedKey('3')
        break
      default:
        setSelectedKey('1')
    }
  }, [location.pathname])

  const menuItems = []

  menuItems.push({
    key: '1',
    icon: <UserOutlined className="text-lg" />,
    label: (
      <Link to="/" className="text-white hover:text-white">
        Dashboard
      </Link>
    ),
    className: 'hover:bg-blue-600 transition-colors duration-200'
  })

  menuItems.push({
    key: '2',
    icon: <ReadOutlined className="text-lg" />,
    label: (
      <Link to="/classes-management" className="text-white hover:text-white">
        Classes
      </Link>
    ),
    className: 'hover:bg-blue-600 transition-colors duration-200'
  })

  if (auth?.role?.includes('admin')) {
    menuItems.push({
      key: '3',
      icon: <TeamOutlined className="text-lg" />,
      label: (
        <Link to="/admin" className="text-white hover:text-white">
          Management Teacher Account
        </Link>
      ),
      className: 'hover:bg-blue-600 transition-colors duration-200'
    })
  }

  menuItems.push({
    key: '4',
    icon: <LogoutOutlined className="text-lg" />,
    label: <span className="text-white">Sign out</span>,
    className: 'hover:bg-red-500 bg-red-500 mt-4 transition-colors duration-200',
    onClick: () => setIsLogoutModalOpen(true)
  })

  return (
    <AntdLayout className="min-h-screen">
      <Sider
        className="bg-primary-color shadow-lg"
        width={250}
        collapsed={collapsed}
        trigger={null}
        collapsible
        theme="dark"
        breakpoint="lg"
        onBreakpoint={broken => setCollapsed(broken)}
      >
        <div className="flex items-center justify-center border-b border-blue-400 p-4">
          <img className={`transition-all duration-300 ${collapsed ? 'w-10' : 'w-40'}`} src={Logo} alt="Logo" />
        </div>
        <Menu
          className="bg-primary-color border-0"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          theme="dark"
          inlineIndent={12}
        />
      </Sider>
      <AntdLayout>
        <SharedHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
        />
        <Content className="p-4">{children}</Content>
      </AntdLayout>
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </AntdLayout>
  )
}

export default Layout

import { HomeOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons'
import LogoutOutlined from '@ant-design/icons/lib/icons/LogoutOutlined'
import { Logo } from '@assets/images'
import LogoutModal from '@pages/LogoutModal'
import SharedHeader from '@shared/ui/Header/SharedHeader'

import { Layout as AntdLayout, Menu, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const { Sider, Content } = AntdLayout

const Layout = ({ children }) => {
  // @ts-ignore
  const auth = useSelector(state => state.auth)
  const [collapsed, setCollapsed] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const location = useLocation()
  const [selectedKey, setSelectedKey] = useState('1')
  const navigate = useNavigate()

  useEffect(() => {
    const savedKey = localStorage.getItem('selectedMenuKey')
    setSelectedKey(savedKey || '1')
  }, [])

  useEffect(() => {
    const savedKey = localStorage.getItem('selectedMenuKey')
    if (!savedKey) {
      switch (location.pathname) {
        case '/':
          setSelectedKey('1')
          localStorage.setItem('selectedMenuKey', '1')
          break
        case '/classes-management':
          setSelectedKey('2')
          localStorage.setItem('selectedMenuKey', '2')
          break
        case '/account-management':
          setSelectedKey('3')
          localStorage.setItem('selectedMenuKey', '3')
          break
        default:
          setSelectedKey('1')
          localStorage.setItem('selectedMenuKey', '1')
      }
    } else {
      setSelectedKey(savedKey)
      if (location.pathname === '/') {
        if (savedKey === '2') navigate('/classes-management')
        if (savedKey === '3') navigate('/account-management')
      }
    }
  }, [location.pathname])

  const handleMenuClick = ({ key }) => {
    if (key === '4') {
      setIsLogoutModalOpen(true)
    } else {
      setSelectedKey(key)
      localStorage.setItem('selectedMenuKey', key)
    }
  }
  const baseMenuItemClass = 'bg-primary-color text-white hover:bg-white hover:text-black transition-colors duration-200'
  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined className="text-xl" />,
      label: (
        <Link to="/" className="text-base font-medium text-white hover:text-white">
          Dashboard
        </Link>
      ),
      className: 'hover:bg-white hover:text-[#003087] transition-colors duration-200'
    },
    {
      key: '2',
      icon: <TeamOutlined className="text-xl" />,
      label: (
        <Link to="/classes-management" className="text-base font-medium text-white hover:text-white">
          Classes
        </Link>
      ),
      className: 'hover:bg-white hover:text-[#003087] transition-colors duration-200'
    }
  ]
  if (auth?.role?.includes('admin')) {
    menuItems.push({
      key: '3',
      icon: <SettingOutlined className="text-lg" />,
      label: (
        <Link to="/account-management" className="text-[16px] text-white hover:text-white">
          Management Accounts
        </Link>
      ),
      className: baseMenuItemClass
    })
  }

  return (
    <AntdLayout className="bg-primary-color min-h-screen">
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
        <div className="flex-col items-center justify-center border-b border-blue-400 p-4">
          <div className="mb-2 flex items-center justify-center">
            <img className={`transition-all duration-300 ${collapsed ? 'w-12' : 'w-30'}`} src={Logo} alt="Logo" />
          </div>
          <div
            className={`flex items-center justify-center text-[30px] font-[400] text-white transition-all duration-300 ${collapsed ? 'hidden' : 'block'}`}
          >
            <p>GreenPREP</p>
          </div>
        </div>
        <Menu
          className="bg-primary-color border-0 [&_.ant-menu-item-selected]:bg-white [&_.ant-menu-item-selected_.anticon]:text-black [&_.ant-menu-item-selected_a]:text-black"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems}
          theme="dark"
          inlineIndent={12}
        />
        <div className="w-full px-4">
          <Divider className="my-4 border-t border-white" />
        </div>
        <Menu
          className="bg-primary-color border-0"
          mode="inline"
          selectedKeys={selectedKey === '4' ? ['4'] : []}
          onClick={handleMenuClick}
          theme="dark"
          items={[
            {
              key: '4',
              icon: <LogoutOutlined className="text-xl" />,
              label: <span className="text-base font-medium text-white">Sign out</span>,
              className: 'hover:bg-red-500 transition-colors duration-200'
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
        <Content className="bg-primary-color">
          <div className="min-h-[calc(100vh-64px)] rounded-tl-lg bg-white p-6 shadow">{children}</div>
        </Content>
      </AntdLayout>
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </AntdLayout>
  )
}

export default Layout

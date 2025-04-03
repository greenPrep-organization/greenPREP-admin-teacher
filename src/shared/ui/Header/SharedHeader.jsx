import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import LogoutModal from '@pages/LogoutModal'
import { Button, Dropdown, Layout, Menu } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const { Header } = Layout

// eslint-disable-next-line no-unused-vars
const SharedHeader = ({ collapsed, setCollapsed, onLogoutClick }) => {
  // @ts-ignore
  const { user } = useSelector(state => state.auth)
  const userInitial = user?.firstName
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
  }

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to={`/profile/${user?.userId}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="1" onClick={handleLogoutClick}>
        Sign Out
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className="bg-primary-color flex h-[80px] items-center justify-between border-0 border-l border-solid border-neutral-400 p-4">
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            color: 'white'
          }}
        />
      </div>
      <Dropdown overlay={menu} trigger={['click']}>
        <a
          className="ant-dropdown-link flex h-[40px] w-auto min-w-[140px] max-w-[200px] cursor-pointer items-center justify-between gap-2.5 rounded-[5px] bg-[#3758F96B] px-2 text-white md:h-[50px] md:min-w-[180px] md:max-w-[234px]"
          onClick={e => e.preventDefault()}
        >
          <span className="flex items-center space-x-1">
            <span>Hi,</span>
            <span className="">{user?.firstName}</span>
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black bg-white font-bold text-black md:h-10 md:w-10 md:rounded-[50%]">
            {userInitial}
          </span>
          <DownOutlined className="text-xs text-white md:text-sm" />
        </a>
      </Dropdown>
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </Header>
  )
}

export default SharedHeader

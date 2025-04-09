import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Layout, Menu } from 'antd'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const { Header } = Layout

const SharedHeader = ({ collapsed, setCollapsed, onLogoutClick }) => {
  // @ts-ignore
  const { user } = useSelector(state => state.auth)
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to={`/profile/${user?.userId}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="1" onClick={onLogoutClick}>
        Sign Out
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className="bg-primary-color flex h-[80px] items-center justify-between p-4">
      <div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-white transition hover:text-white/80"
        />
      </div>
      <div className="flex items-center">
        <Dropdown overlay={menu} trigger={['click']} overlayClassName="border-none shadow-none">
          <a
            className="bg-primary-color hover:bg-primary-color/80 flex h-12 w-auto min-w-[150px] max-w-[220px] cursor-pointer items-center gap-3 rounded-md px-3 text-white transition"
            onClick={e => e.preventDefault()}
          >
            <Avatar className="bg-primary-color flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-lg font-semibold text-white">
              {user?.lastName?.charAt(0)}
            </Avatar>
            <span className="flex items-center space-x-1 text-base">
              <span className="font-medium">{user?.lastName}</span>
              <DownOutlined className="text-base text-white" />
            </span>
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}

export default SharedHeader

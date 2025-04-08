import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Layout, Menu } from 'antd'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const { Header } = Layout

const SharedHeader = ({ collapsed, setCollapsed }) => {
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    navigate('/login')
  }
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to={`/profile/${user?.userId}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="1" onClick={handleLogout}>
        Sign Out
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className="flex h-[80px] items-center justify-between bg-blue-900 p-4">
      <div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-white transition hover:text-gray-300"
        />
      </div>
      <div className="flex items-center">
        <Dropdown overlay={menu} trigger={['click']} overlayClassName="border-none shadow-none">
          <a
            className="flex h-12 w-auto min-w-[150px] max-w-[220px] cursor-pointer items-center gap-3 rounded-md bg-blue-900 px-3 text-white transition hover:bg-blue-900"
            onClick={e => e.preventDefault()}
          >
            <Avatar className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-900 text-lg font-semibold text-white">
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

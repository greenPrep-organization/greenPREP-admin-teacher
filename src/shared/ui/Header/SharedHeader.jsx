import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { logout } from '@app/providers/reducer/auth/authSlice'
import { Avatar, Button, Dropdown, Layout, Menu } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const { Header } = Layout

const SharedHeader = ({ collapsed, setCollapsed }) => {
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
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
    <Header className="bg-primary-color flex h-[80px] items-center justify-between border-0 border-l border-solid border-neutral-400 p-4">
      <div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-white transition hover:text-gray-300"
        />
      </div>
      <div className="flex items-center">
        <Dropdown overlay={menu} trigger={['click']}>
          <a
            className="ant-dropdown-link flex h-10 w-auto min-w-[150px] max-w-[220px] cursor-pointer items-center justify-between gap-3 rounded-md bg-[#3758F9] px-3 text-white shadow-md transition hover:bg-[#2F4CC9] md:h-12 md:min-w-[180px] md:max-w-[240px]"
            onClick={e => e.preventDefault()}
          >
            <span className="flex items-center space-x-1 text-sm md:text-base">
              <span>Hi,</span>
              <span className="font-medium">{user?.lastName}</span>
            </span>
            <Avatar className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-500 text-sm font-semibold text-white md:h-10 md:w-10">
              {user?.lastName?.charAt(0)}
            </Avatar>
            <DownOutlined className="text-sm text-white md:text-base" />
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}

export default SharedHeader

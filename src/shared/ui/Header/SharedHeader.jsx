import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Dropdown, Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const { Header } = Layout

const SharedHeader = ({ collapsed, setCollapsed }) => {
  const { user } = useSelector(state => state.auth)
  const userInitial = user?.firstName

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to={`/profile/${user?.id || 1}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link to="/signout">Sign Out</Link>
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
    </Header>
  )
}

export default SharedHeader

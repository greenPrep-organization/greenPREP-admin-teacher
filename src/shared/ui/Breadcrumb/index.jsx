import { Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const AppBreadcrumb = ({ items = [] }) => {
  const navigate = useNavigate()

  return (
    <Breadcrumb className="mb-4" style={{ cursor: 'pointer' }}>
      <Breadcrumb.Item onClick={() => navigate('/dashboard')}>
        <HomeOutlined />
        <span> Dashboard</span>
      </Breadcrumb.Item>
      {items.map((item, index) => (
        <Breadcrumb.Item key={index} onClick={() => item.path && navigate(item.path, { state: item.state || {} })}>
          {item.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
}

export default AppBreadcrumb

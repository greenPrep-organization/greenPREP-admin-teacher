import { Button, Space } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'

const Navbar = () => {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <Space size="middle">
        <Button
          type="primary"
          className="absolute left-[40px] top-[70px] flex h-[27px] w-[60px] items-center justify-center border-[#C0C0C0] bg-[#003087] hover:bg-[#002366] active:bg-[#001a4d]"
        >
          {'<'} Back
        </Button>
        <Button className="absolute left-[620px] top-[60px] flex h-[42px] w-[165px] items-center justify-center border-[#C0C0C0] bg-white text-[#003087] hover:bg-[#E5E7EB] active:bg-[#D1D5DB]">
          {'<'} Previous Student
        </Button>
        <Button
          className="absolute left-[800px] top-[60px] flex h-[42px] w-[175px] items-center justify-center rounded-[5px] border border-[#C0C0C0] bg-white text-[#003087] hover:bg-[#E5E7EB] active:bg-[#D1D5DB]"
          icon={<UnorderedListOutlined />}
        >
          Change Student
        </Button>
        <Button
          type="primary"
          className="absolute left-[990px] top-[60px] flex h-[42px] w-[165px] items-center justify-center rounded-[5px] border border-[#C0C0C0] bg-[#003087] hover:bg-[#002366] active:bg-[#001a4d]"
        >
          Next Student {'>'}
        </Button>
      </Space>
    </div>
  )
}

export default Navbar

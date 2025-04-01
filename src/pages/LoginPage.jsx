import { useState } from 'react'
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined'
import EyeOutlined from '@ant-design/icons/EyeOutlined'
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined'
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Typography, Space, Row, Col } from 'antd'
import { LoginImg } from '../assets/Images/index'
import axios from 'axios'
import { ACCESS_TOKEN } from '@shared/lib/constants/auth'

const { Title, Text } = Typography

const LoginPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginSuccess, setLoginSuccess] = useState('')
  const [passwordTouched, setPasswordTouched] = useState(false)
  const navigate = useNavigate()

  const onFinish = async values => {
    setLoading(true)
    setLoginError('')
    setLoginSuccess('')

    try {
      // Login request
      const response = await axios.post('https://dev-api-greenprep.onrender.com/api/users/login', {
        email: values.email,
        password: values.password
      })

      console.log('Login response:', response.data)

      // Store access token
      if (response.data?.data?.access_token) {
        localStorage.setItem(ACCESS_TOKEN, response.data.data.access_token)
      }

      setLoginSuccess('Login successful! Redirecting...')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = () => {
    setLoginError('')
    setPasswordTouched(true)
  }

  const password = Form.useWatch('password', form)
  const showPasswordError = passwordTouched && !password

  return (
    <Row className="min-h-screen bg-white">
      <Col xs={24} md={12} className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-[400px] py-8 sm:py-12">
          <Space direction="vertical" size={24} className="w-full">
            <Title level={1} className="!m-0 !text-xl !text-[#003087] sm:!text-2xl">
              GreenPREP
            </Title>

            <Space direction="vertical" size={8}>
              <Title level={2} className="!m-0 !text-xl !font-semibold !text-black sm:!text-2xl">
                Sign in
              </Title>
              <Text className="!text-sm !text-gray-500">Sign in to access your account.</Text>
            </Space>

            <Form
              form={form}
              name="login"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="on"
              requiredMark={false}
              className="flex flex-col gap-4 sm:gap-5"
            >
              <Form.Item
                label={
                  <Text strong className="!text-sm">
                    Email <span className="text-red-500">*</span>
                  </Text>
                }
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Email is required'
                  }
                ]}
                className="!mb-1"
              >
                <Input
                  placeholder="Enter your email"
                  className="!h-11 !rounded-md !border !border-gray-200 !bg-gray-50 !px-4 !py-2.5 !text-base"
                />
              </Form.Item>

              <div className="space-y-1">
                <Form.Item
                  label={
                    <Text strong className="!text-sm">
                      Password <span className="text-red-500">*</span>
                    </Text>
                  }
                  name="password"
                  className="!mb-0"
                  validateStatus={showPasswordError || loginError ? 'error' : loginSuccess ? 'success' : ''}
                >
                  <Input.Password
                    placeholder="••••••••••"
                    onChange={handlePasswordChange}
                    className={`!h-11 !rounded-md !border !bg-gray-50 !px-4 !py-2.5 !text-base ${
                      showPasswordError || loginError
                        ? '!border-red-500'
                        : loginSuccess
                          ? '!border-green-500'
                          : '!border-gray-200'
                    }`}
                    iconRender={visible =>
                      visible ? (
                        <EyeOutlined className="text-gray-400" />
                      ) : (
                        <EyeInvisibleOutlined className="text-gray-400" />
                      )
                    }
                    suffix={
                      showPasswordError || loginError ? (
                        <ExclamationCircleOutlined className="text-red-500" />
                      ) : loginSuccess ? (
                        <CheckCircleOutlined className="text-green-500" />
                      ) : null
                    }
                  />
                </Form.Item>
                {showPasswordError && (
                  <Text type="danger" className="!text-sm">
                    Password is required
                  </Text>
                )}
                {loginError && !showPasswordError && (
                  <Text type="danger" className="!text-sm">
                    {loginError}
                  </Text>
                )}
                {loginSuccess && (
                  <Space size={4} className="!text-sm !text-green-500">
                    <CheckCircleOutlined />
                    <Text type="success" className="!text-sm">
                      {loginSuccess}
                    </Text>
                  </Space>
                )}
              </div>

              <div className="mb-2 flex justify-end sm:mb-4">
                <Link to="/forgot-password" className="!text-sm !text-[#003087] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="!h-11 !w-full !rounded-md !bg-[#003087] !text-base !font-medium hover:!bg-blue-900"
                >
                  Sign in
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </div>
      </Col>

      <Col xs={0} md={12} className="bg-white-50 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="mx-auto w-full max-w-[640px] px-8 sm:px-12">
            <img src={LoginImg} alt="Login Security Illustration" className="h-auto w-full object-contain" />
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default LoginPage

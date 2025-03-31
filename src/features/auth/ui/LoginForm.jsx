import { useState } from 'react'
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined'
import EyeOutlined from '@ant-design/icons/EyeOutlined'
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined'
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { LoginImg } from '../../../assets/Images'

// Fake users database
const FAKEUSERS = [
  { email: 'teacher@gmail.com', password: '123456', role: 'teacher' },
  { email: 'admin@gmail.com', password: '123456', role: 'admin' },
  { email: 'student@gmail.com', password: '123456', role: 'student' }
]

const LoginForm = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginSuccess, setLoginSuccess] = useState('')
  const [passwordTouched, setPasswordTouched] = useState(false)
  const navigate = useNavigate()

  const onFinish = values => {
    setLoading(true)
    setLoginError('')
    setLoginSuccess('')

    // Simulate API call
    setTimeout(() => {
      const user = FAKEUSERS.find(u => u.email === values.email && u.password === values.password)

      if (user) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(user))
        setLoginSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      } else {
        setLoginError('Invalid email or password')
      }
      setLoading(false)
    }, 1000)
  }

  const handlePasswordChange = () => {
    setLoginError('')
    setPasswordTouched(true)
  }

  const password = Form.useWatch('password', form)
  const showPasswordError = passwordTouched && !password

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 md:w-1/2 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-[440px] py-8 sm:py-12">
          <div className="mb-8 sm:mb-10">
            <h1 className="text-xl font-semibold text-[#003087] sm:text-2xl">GreenPREP</h1>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl font-semibold text-black sm:text-2xl">Sign in</h2>
            <p className="mt-1 text-sm text-gray-500 sm:mt-2">Sign in to access your account.</p>
          </div>

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
                <span className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </span>
              }
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Email is required'
                }
              ]}
              className="mb-1"
            >
              <Input
                placeholder="Enter your email"
                className="h-11 rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-base"
              />
            </Form.Item>

            <div className="space-y-1">
              <Form.Item
                label={
                  <span className="text-sm font-medium">
                    Password <span className="text-red-500">*</span>
                  </span>
                }
                name="password"
                className="mb-0"
                validateStatus={showPasswordError || loginError ? 'error' : loginSuccess ? 'success' : ''}
              >
                <Input.Password
                  placeholder="••••••••••"
                  onChange={handlePasswordChange}
                  className={`h-11 rounded-md border bg-gray-50 px-4 py-2.5 text-base ${
                    showPasswordError || loginError
                      ? 'border-red-500'
                      : loginSuccess
                        ? 'border-green-500'
                        : 'border-gray-200'
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
              {showPasswordError && <div className="text-sm text-red-500">Password is required</div>}
              {loginError && !showPasswordError && <div className="text-sm text-red-500">{loginError}</div>}
              {loginSuccess && (
                <div className="flex items-center gap-1 text-sm text-green-500">
                  <CheckCircleOutlined />
                  {loginSuccess}
                </div>
              )}
            </div>

            <div className="mb-2 flex justify-end sm:mb-4">
              <Link to="/forgot-password" className="text-sm text-[#003087] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="h-11 w-full rounded-md bg-[#003087] text-base font-medium hover:bg-blue-900"
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <div className="bg-white-50 hidden md:flex md:w-1/2 md:items-center md:justify-center">
        <div className="relative h-full w-full max-w-[640px] p-8 sm:p-12">
          <img src={LoginImg} alt="Login Security Illustration" className="h-auto w-full object-contain" />
        </div>
      </div>
    </div>
  )
}

export default LoginForm

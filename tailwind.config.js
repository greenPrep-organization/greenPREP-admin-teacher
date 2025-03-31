/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "0px",
      xsS: "300px",
      xsM: "410px",
      xsL: "470px",
      sm: "600px",
      smXS: "642px",
      smS: "681px",
      smM: "746px",
      smL: "780px",
      md: "960px", // > iPad gen 9 vertical (810x1080)
      mdS: "1045px",
      mdM: "1120px",
      mdL: "1230px",
      lg: "1281px",
      lgS: "1350px",
      lgM: "1440px",
      lgL: "1600px",
      xl: "1920px",
    },
    extend: {
      colors: {
        // Status colors
        completed: {
          DEFAULT: '#00B087',
          bg: '#E5FAF5',
          text: '#00B087'
        },
        progress: {
          DEFAULT: '#0091FF',
          bg: '#E5F6FF',
          text: '#0091FF'
        },
        pending: {
          DEFAULT: '#FF9500',
          bg: '#FFF5E5',
          text: '#FF9500'
        },
        default: {
          DEFAULT: '#666666',
          bg: '#F5F5F5',
          text: '#666666'
        },
        // Common colors
        primary: '#1890ff',
        success: '#52c41a',
        warning: '#faad14',
        error: '#f5222d',
        // Text colors
        text: {
          primary: '#262626',
          secondary: '#595959',
          disabled: '#bfbfbf'
        },
        // Background colors
        bg: {
          default: '#ffffff',
          grayLight: '#f5f5f5',
          gray: '#e8e8e8'
        },
        // Border colors
        border: {
          DEFAULT: '#d9d9d9',
          light: '#f0f0f0'
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

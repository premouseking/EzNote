/**
 * 模拟后端登录API响应
 * 用于开发和测试阶段
 */

// 模拟用户数据库
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: '123456', // 实际应用中密码应该加密存储
    role: 'admin',
    avatar: '',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    username: 'john_doe',
    email: 'john@example.com',
    password: '123456',
    role: 'user',
    avatar: '',
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    username: '张三',
    email: 'zhangsan@test.com',
    password: '123456',
    role: 'user',
    avatar: '',
    createdAt: '2024-01-03T00:00:00.000Z'
  }
];

/**
 * 模拟登录API
 * @param {Object} credentials - 登录凭据
 * @param {string} credentials.username - 用户名或邮箱
 * @param {string} credentials.password - 密码
 * @param {boolean} credentials.rememberMe - 是否记住登录状态
 * @returns {Promise<Object>} 登录响应
 */
export const mockLoginAPI = {
  async login(credentials) {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        try {
          const { username, password } = credentials;
          
          // 检测输入类型
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          const isEmailInput = emailRegex.test(username.trim());
          
          // 查找用户
          let user = null;
          if (isEmailInput) {
            user = mockUsers.find(u => u.email.toLowerCase() === username.toLowerCase());
          } else {
            user = mockUsers.find(u => u.username === username);
          }
          
          // 验证用户存在
          if (!user) {
            reject({
              response: {
                status: 404,
                data: {
                  success: false,
                  message: isEmailInput ? '邮箱不存在' : '用户名不存在'
                }
              }
            });
            return;
          }
          
          // 验证密码
          if (user.password !== password) {
            reject({
              response: {
                status: 401,
                data: {
                  success: false,
                  message: '密码错误'
                }
              }
            });
            return;
          }
          
          // 生成JWT令牌（简化版）
          const token = btoa(JSON.stringify({
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            loginTime: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24小时后过期
          }));
          
          // 返回成功响应（不包含密码）
          const userInfo = { ...user };
          delete userInfo.password;
          
          resolve({
            data: {
              success: true,
              data: {
                token: token,
                user: userInfo
              },
              message: `${isEmailInput ? '邮箱' : '用户名'}登录成功`
            }
          });
          
        } catch (error) {
          reject({
            response: {
              status: 500,
              data: {
                success: false,
                message: '服务器内部错误'
              }
            }
          });
        }
      }, 1000); // 模拟1秒网络延迟
    });
  }
};

/**
 * 设置axios拦截器，在开发环境中使用mock数据
 */
export function setupMockInterceptors(axios) {
  // 只在开发环境或没有配置真实API时使用mock
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Mock API 已启用');
    
    // 拦截登录请求
    axios.interceptors.request.use(
      async (config) => {
        if (config.url === '/api/login' && config.method === 'post') {
          console.log('🔀 拦截登录请求，使用Mock数据');
          
          try {
            const response = await mockLoginAPI.login(config.data);
            // 创建一个假的响应对象
            const mockResponse = {
              data: response.data,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: config
            };
            
            // 直接返回Promise，跳过实际的网络请求
            return Promise.resolve(mockResponse);
          } catch (error) {
            return Promise.reject(error);
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}

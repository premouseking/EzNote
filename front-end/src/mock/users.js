// 模拟用户数据
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: '123456',
    role: 'admin',
    createTime: '2024-01-01'
  },
  {
    id: 2,
    username: 'john_doe',
    email: 'john@gmail.com',
    password: 'password123',
    role: 'user',
    createTime: '2024-01-02'
  },
  {
    id: 3,
    username: '张三',
    email: 'zhangsan@qq.com',
    password: '654321',
    role: 'user',
    createTime: '2024-01-03'
  },
  {
    id: 4,
    username: 'test_user',
    email: 'test@outlook.com',
    password: 'test2024',
    role: 'user',
    createTime: '2024-01-04'
  }
];

// 模拟API响应
export const mockUsersAPI = {
  // 获取所有用户（用于前端登录验证）
  getAllUsers: () => {
    return new Promise((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        resolve({
          data: {
            users: mockUsers,
            total: mockUsers.length,
            message: '获取用户数据成功'
          }
        });
      }, 300);
    });
  },

  // 根据用户名查找用户
  findByUsername: (username) => {
    return mockUsers.find(user => user.username === username);
  },

  // 根据邮箱查找用户
  findByEmail: (email) => {
    return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  }
};

<template>
<div class="login-container">
        <div class="logo">格知</div>
        <h1 id="login-header">用户登录</h1>
        
        <!-- 登录表单 -->
        <form id="loginForm" @submit.prevent="onSubmit">
            <div class="form-group">
                <label for="username">用户名</label>
                <div class="input-with-icon">
                    <div class="input-icon">👤</div>
                    <input 
                      type="text" 
                      id="username" 
                      placeholder="请输入用户名" 
                      required
                      v-model="loginForm.username"
                    >
                </div>
                <div class="error" id="username-error" v-if="errors.username">{{ errors.username }}</div>
            </div>
            
            <div class="form-group">
                <label for="password">密码</label>
                <div class="password-container input-with-icon">
                    <div class="input-icon">🔒</div>
                    <input 
                      :type="passwordVisible ? 'text' : 'password'" 
                      id="password" 
                      placeholder="请输入密码" 
                      required
                      v-model="loginForm.password"
                    >
                    <span class="toggle-password" id="togglePassword" @click="togglePasswordVisibility">👁️</span>
                </div>
                <div class="error" id="password-error" v-if="errors.password">{{ errors.password }}</div>
            </div>
            
            <div class="remember-forgot">
                <div class="remember">
                    <input type="checkbox" id="remember" v-model="loginForm.remember">
                    <label for="remember">记住我</label>
                </div>
                <a href="#" class="forgot">忘记密码?</a>
            </div>
            
            <button type="submit" class="btn-login" :disabled="loading">
              {{ loading ? '登录中...' : '登 录' }}
            </button>
        </form>
        
        <div class="signup-link" id="signupLink">
            还没有账号? <a href="#" @click.prevent="toRegister">立即注册</a>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      errors: {},
      passwordVisible: false,
      loading: false
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible
    },
    
    onSubmit() {
      // 重置错误信息
      this.errors = {}
      
      // 简单验证
      if (!this.loginForm.username) {
        this.errors.username = "请输入用户名"
        return
      }
      
      if (!this.loginForm.password) {
        this.errors.password = "请输入密码"
        return
      }
      
      this.loading = true
      
      // 使用 Vuex action
      this.login({
        username: this.loginForm.username,
        password: this.loginForm.password,
        remember: this.loginForm.remember
      })
      .then(() => {
        // 登录成功，跳转到首页
        this.$router.push('/home')
      })
      .catch(error => {
        this.errors.general = "登录失败：" + (error.response?.data?.message || "未知错误")
      })
      .finally(() => {
        this.loading = false
      })
    },
    
    toRegister() {
      this.$router.push('/register')
    }
  },
  created() {
    // 检查是否有记住的用户名
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) {
      this.loginForm.username = savedUsername
      this.loginForm.remember = true
    }
  }
}
</script>


<style>
 * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #ebe6f0 0%, #7da6ee 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .login-container {
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
            width: 100%;
            max-width: 480px;
            padding: 40px;
            text-align: center;
            animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .logo {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #ede3f7 0%, #2575fc 100%);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        h1 {
            color: #333;
            margin-bottom: 30px;
            font-weight: 600;
            font-size: 28px;
        }
        
        .form-group {
            margin-bottom: 20px;
            text-align: left;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
        }
        
        .input-with-icon {
            position: relative;
        }
        
        .input-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #777;
        }
        
        input {
            width: 100%;
            padding: 14px 14px 14px 45px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s;
        }
        
        input:focus {
            border-color: #88aff2;
            outline: none;
            box-shadow: 0 0 0 3px rgba(37, 117, 252, 0.2);
        }
        
        .password-container {
            position: relative;
        }
        
        .toggle-password {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #777;
        }
        
        .remember-forgot {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }
        
        .remember {
            display: flex;
            align-items: center;
        }
        
        .remember input {
            width: auto;
            margin-right: 8px;
            accent-color: #7ca6ed;
        }
        
        .forgot {
            color: #79a7f7;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        .forgot:hover {
            text-decoration: underline;
            color: #e9dcf7;
        }
        
        .btn-login {
            background: linear-gradient(135deg, #6898ec 100%);
            color: white;
            border: none;
            padding: 14px;
            width: 100%;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: 20px;
            letter-spacing: 1px;
        }
        
        .btn-login:hover {
            transform: translateY(-3px);
            box-shadow: 0 7px 15px rgba(37, 117, 252, 0.4);
        }
        
        .btn-logout {
            background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 20px;
            display: block;
            margin: 30px auto 0;
        }
        
        .btn-login:active {
            transform: translateY(0);
        }
        
        .signup-link {
            color: #666;
            font-size: 15px;
            margin-top: 15px;
        }
        
        .signup-link a {
            color: #7da9f4;
            text-decoration: none;
            font-weight: 500;
            margin-left: 5px;
            transition: all 0.2s;
        }
        
        .signup-link a:hover {
            text-decoration: underline;
            color: #e8d6fb;
        }
        
        .error {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 5px;
            display: none;
        }
        
        .jwt-status {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin-top: 25px;
            text-align: left;
            border: 1px solid #eee;
            display: none;
        }
        
        .jwt-status h3 {
            color: #e9dcf8;
            margin-bottom: 8px;
            font-size: 16px;
        }
        
        .jwt-status p {
            font-size: 14px;
            color: #666;
            line-height: 1.5;
            word-break: break-all;
            margin-bottom: 10px;
        }
        
        .user-info {
            margin: 20px 0;
            padding: 15px;
            background: rgba(37, 117, 252, 0.1);
            border-radius: 8px;
            display: none;
        }
        
        .user-info h3 {
            color: #2575fc;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .user-info ul {
            list-style: none;
            padding: 0;
        }
        
        .user-info li {
            padding: 8px 0;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            display: flex;
        }
        
        .user-info li:last-child {
            border-bottom: none;
        }
        
        .user-info .label {
            width: 80px;
            font-weight: 600;
            color: #555;
        }
        
        @media (max-width: 480px) {
            .login-container {
                padding: 30px 20px;
            }
            
            .remember-forgot {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .forgot {
                margin-top: 10px;
            }
            
            h1 {
                font-size: 24px;
            }
        }

</style>
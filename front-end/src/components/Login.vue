<template>
  <div class="login-container">
    <div class="logo">格知</div>
    <h1>登录账户</h1>
    
    <div class="success-message" v-if="showSuccess">
      <h2>登录成功！</h2>
    </div>
    
    <el-form 
      :model="loginForm" 
      :rules="rules" 
      ref="loginFormRef" 
      label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
        <el-input 
          v-model="loginForm.username" 
          placeholder="输入用户名或邮箱"
          @input="onUsernameInput">
        </el-input>
        <div class="input-hint" v-if="inputHint">
          <span class="hint-text" :class="hintClass">{{ inputHint }}</span>
        </div>
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input 
          v-model="loginForm.password" 
          type="password" 
          placeholder="输入密码"
          show-password>
        </el-input>
      </el-form-item>
      
      <el-form-item prop="rememberMe">
        <el-checkbox v-model="loginForm.rememberMe">
          记住登录状态
        </el-checkbox>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="onSubmit" class="btn-login" :loading="isLoading">
          {{ isLoading ? '登录中...' : '登录' }}
        </el-button>
      </el-form-item>
      
      <div class="forgot-password">
        <a href="#" @click.prevent="forgotPassword">忘记密码？</a>
      </div>
      
      <div class="signup-link">
        还没有账户？<a href="#" @click.prevent="toRegister">立即注册</a>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },      
      showSuccess: false,
      isLoading: false,
      inputHint: '', // 输入提示文本
      hintClass: '', // 提示样式类
      rules: {
        username: [
          { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
          { min: 1, max: 20, message: '用户名长度在1到20个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    ...mapActions('auth', ['login']),
    
    /**
     * 处理用户名输入变化，提供基本的输入提示
     */
    onUsernameInput(value) {
      if (!value || value.trim() === '') {
        this.inputHint = '';
        this.hintClass = '';
        return;
      }
      
      const trimmedValue = value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailRegex.test(trimmedValue);
      
      if (isEmail) {
        this.inputHint = '正在输入邮箱';
        this.hintClass = 'hint-success';
      } else {
        this.inputHint = '正在输入用户名';
        this.hintClass = 'hint-success';
      }
    },

    /**
     * 提交登录表单
     */
    onSubmit() {
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.isLoading = true
          
          // 构建登录数据，让后端处理验证
          const loginData = {
            username: this.loginForm.username.trim(), 
            password: this.loginForm.password,
            rememberMe: this.loginForm.rememberMe
          };
          
          // 显示登录提示
          this.$message.info('正在验证登录信息...');
          
          this.login(loginData)
          .then(() => {
            this.showSuccess = true
            this.$message.success('登录成功！')
            
            setTimeout(() => {
              
              const redirect = this.$route.query.redirect || '/home'
              this.$router.push(redirect)
            }, 1500)
          })
          .catch(error => {
            // 处理登录错误 - 直接显示后端返回的错误信息
            console.error('登录失败:', error)
            
            // 显示具体的错误信息
            this.$message.error(error.message || '登录失败，请稍后重试')
            
            // 清空提示
            this.inputHint = '';
            this.hintClass = '';
          })
          .finally(() => {
            this.isLoading = false
          })
        }
      })
    },

    /**
     * 跳转到注册页面
     */
    toRegister() {
      this.$router.push('/register')
    },

    /**
     * 忘记密码处理
     */
    forgotPassword() {
      this.$message.info('忘记密码功能还在制作中')
      // 这里可以实现忘记密码的逻辑
      // this.$router.push('/forgot-password')
    }
  },

  mounted() {
    // 如果用户已经登录，直接跳转到首页
    if (this.$store.getters['auth/isAuthenticated']) {
      this.$router.push('/home')
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
  width: 480px; 
  max-width: 90vw; 
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

.success-message {
  text-align: center;
  padding: 20px;
  background-color: rgba(37, 117, 252, 0.1);
  border-radius: 10px;
  animation: fadeIn 0.5s;
  margin-bottom: 20px;
}

/* 输入提示样式 */
.input-hint {
  margin-top: 5px;
  text-align: left;
}

.hint-text {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-block;
  animation: slideIn 0.3s ease-out;
  transition: all 0.3s ease;
}

.hint-success {
  color: #67c23a;
  background-color: rgba(103, 194, 58, 0.1);
}

.hint-warning {
  color: #e6a23c;
  background-color: rgba(230, 162, 60, 0.1);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Element Plus 样式覆盖 */
.el-form-item__label {
  color: #555 !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  text-align: left !important;
  margin-bottom: 8px !important;
}

/* 输入框样式 */
.el-input__wrapper {
  box-shadow: 0 0 0 1px #ddd !important;
  border-radius: 10px !important;
  padding: 0 15px !important;
  height: 45px !important;
  transition: all 0.3s ease !important;
}

.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #88aff2, 0 0 0 3px rgba(37, 117, 252, 0.2) !important;
}

.el-input__inner {
  height: 45px !important;
}

.el-input__prefix {
  left: 15px !important;
}

/* 按钮样式 */
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

/* 复选框样式 */
.el-checkbox__inner {
  accent-color: #7ca6ed !important;
}

.el-checkbox__label {
  font-size: 14px !important;
}

/* 忘记密码链接 */
.forgot-password {
  text-align: center;
  margin-bottom: 15px;
}

.forgot-password a {
  color: #7da9f4;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
}

.forgot-password a:hover {
  text-decoration: underline;
  color: #2575fc;
}

/* 注册链接 */
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
  color: #2575fc;
}

@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .logo {
    width: 80px;
    height: 80px;
    font-size: 26px;
  }
}

.el-form-item.is-error .el-input__wrapper {
  box-shadow: 0 0 0 1px #f56c6c !important;
  border: none !important;
}

.el-form-item.is-error .el-input__wrapper:hover,
.el-form-item.is-error .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #f56c6c, 0 0 0 3px rgba(245, 108, 108, 0.2) !important;
}

.el-input__inner {
  border: none !important;
  height: 45px !important;
  outline: none !important;
  box-shadow: none !important;
}

/* 以下为处理输入框自动填充时出现蓝色背景出现的白边问题 */
/* 此为覆盖浏览器自动添加的背景 */
/* ----------------------------------------------------------- */
.el-input input,
.el-input textarea,
.el-input * {
  outline: none !important;
}
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #333 !important;
}

.el-input__inner:-webkit-autofill,
.el-input__inner:-webkit-autofill:hover,
.el-input__inner:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
}
/* ------------------------------------------------------------------- */
</style>
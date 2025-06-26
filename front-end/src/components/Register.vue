<template>
  <div class="login-container">
    <div class="logo">格知</div>
    <h1>创建账户</h1>
    
    <div class="success-message" v-if="showSuccess">
      <h2>注册成功！</h2>
    </div>
    
    <el-form 
      :model="registerForm" 
      :rules="rules" 
      ref="registerFormRef" 
      label-position="top">
      
      <el-form-item label="用户名" prop="username">
        <el-input 
          v-model="registerForm.username" 
          placeholder="输入用户名">
        </el-input>
      </el-form-item>
      
      <el-form-item label="电子邮箱" prop="email">
        <el-input 
          v-model="registerForm.email" 
          placeholder="输入电子邮箱">
        </el-input>
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input 
          v-model="registerForm.password" 
          type="password" 
          placeholder="创建密码"
          show-password>
        </el-input>
      </el-form-item>
      
      <el-form-item label="确认密码" prop="passwordConfirm">
        <el-input 
          v-model="registerForm.passwordConfirm" 
          type="password" 
          placeholder="再次输入密码"
          show-password>
        </el-input>
      </el-form-item>
      
      <el-form-item prop="terms">
        <el-checkbox v-model="registerForm.terms">
          我已阅读并同意<a href="#" @click.prevent="showTerms">服务条款</a>和<a href="#" @click.prevent="showPrivacy">隐私政策</a>
        </el-checkbox>
      </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="onSubmit" class="btn-login" :loading="isLoading">
          {{ isLoading ? '注册中...' : '注册' }}
        </el-button>
      </el-form-item>
      
      <div class="signup-link">
        已有账户？<a href="#" @click.prevent="toLogin">立即登录</a>
      </div>
    </el-form>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  name: "Register",
  data() {
      return {
      registerForm: {
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        terms: false
      },
      errors: {
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
      },
      showSuccess: false,
      isLoading: false,
      rules: {
      username: [
        { required: true, validator: this.validateUsername, trigger: 'blur' }
      ],
      email: [
        { required: true, validator: this.validateEmail, trigger: 'blur' }
      ],
      password: [
        { required: true, validator: this.validatePassword, trigger: 'blur' }
      ],
      passwordConfirm: [
        { required: true, validator: this.validatePasswordConfirm, trigger: 'blur' }
      ],
      terms: [
        { validator: this.validateTerms, trigger: 'change' }
      ]
      }
    }
  },

  methods: {
    ...mapActions('auth', ['register']),

    /**
     * @param rule 验证规则对象
     * @param value 当前输入值
     * @param callback 回调函数，返回验证结果
     * 验证用户名长度
     */
    validateUsername(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入用户名'));
    } else if (value.length < 1 || value.length > 20) {
      callback(new Error('用户名长度在1到20个字符之间'));
    } else {
      callback();
    }
  },

  /**
    * @param rule 验证规则对象
    * @param value 当前输入值
    * @param callback 回调函数，返回验证结果
    * 验证电子邮箱格式
   */
    validateEmail(rule, value, callback) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value === '') {
      callback(new Error('请输入电子邮箱'));
    } else if (!emailRegex.test(value)) {
      callback(new Error('请输入有效的电子邮箱地址'));
    } else {
      callback();
    }
  },

   /**
    * @param rule 验证规则对象
    * @param value 当前输入值
    * @param callback 回调函数，返回验证结果
    * 验证密码长度
    */
    validatePassword(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入密码'));
    } else if (value.length < 6) {
      callback(new Error('密码长度至少为6个字符'));
    } else {
      callback();
    }
  },

    //密码确认验证函数
    /**
     * @param rule 验证规则对象
     * @param value 当前输入值
     * @param callback 回调函数，返回验证结果
     */
    validatePasswordConfirm (rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },

      /**
       * @param rule 验证规则对象
       * @param value 当前输入值
       * @param callback 回调函数，返回验证结果
       * 验证用户是否同意服务条款和隐私政策
       */
    validateTerms(rule, value, callback) {
    if (value === false) {
      callback(new Error('请同意服务条款和隐私政策'));
    } else {
      callback();
    }
  },    
    /**
    * 提交注册表单
    */
    onSubmit() {
      this.$refs.registerFormRef.validate((valid) => {
        if (valid) {
          this.isLoading = true
          
          this.register({
            username: this.registerForm.username,
            password: this.registerForm.password,
            email: this.registerForm.email
          })
          .then(() => {
            this.showSuccess = true
            this.$message.success('注册成功！')
            
            setTimeout(() => {
              // 检查是否有重定向路径
              const redirect = this.$route.query.redirect || '/home'
              this.$router.push(redirect)
            }, 1500)
          })
          .catch(error => {
            // 处理注册错误
            console.error('注册失败:', error)
            this.$message.error(error.message || '注册失败，请稍后重试')
            
          })
          .finally(() => {
            this.isLoading = false
          })
        }
      });    
    },
    
    /**
     * 跳转到登录页面
     */
    toLogin() {
      this.$router.push('/login')
    },

    /**
     * 显示服务条款
     */
    showTerms() {
      this.$message.info('没有服务条款')
      // 这里可以实现显示服务条款的逻辑
      // this.$router.push('/terms')
    },

    /**
     * 显示隐私政策
     */
    showPrivacy() {
      this.$message.info('没有隐私政策')
      // 这里可以实现显示隐私政策的逻辑
      // this.$router.push('/privacy')
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

.success-message {
  text-align: center;
  padding: 20px;
  background-color: rgba(37, 117, 252, 0.1);
  border-radius: 10px;
  animation: fadeIn 0.5s;
  margin-bottom: 20px;
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
            padding:14px;
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

.el-checkbox__label a {
  color: #79a7f7 !important;
  text-decoration: none !important;
}

.el-checkbox__label a:hover {
  text-decoration: underline !important;
  color: #2575fc !important;
}

/* 登录链接 */
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
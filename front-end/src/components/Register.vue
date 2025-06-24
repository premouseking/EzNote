<template>
  <div class="container">
    <h1>创建账户</h1>
    
    <div class="success-message" id="successMessage" v-if="showSuccess">
      <h2>🎉 注册成功！</h2>
    </div>
    
    <el-form 
      :model="registerForm" 
      :rules="rules" 
      ref="registerFormRef" 
      label-position="top">
      
      <el-form-item label="用户名" prop="username">
        <el-input 
          v-model="registerForm.username" 
          placeholder="输入用户名"
          prefix-icon="el-icon-user">
        </el-input>
      </el-form-item>
      
      <el-form-item label="电子邮箱" prop="email">
        <el-input 
          v-model="registerForm.email" 
          placeholder="输入电子邮箱"
          prefix-icon="el-icon-message">
        </el-input>
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input 
          v-model="registerForm.password" 
          type="password" 
          placeholder="创建密码"
          prefix-icon="el-icon-lock"
          show-password>
        </el-input>
      </el-form-item>
      
      <el-form-item label="确认密码" prop="passwordConfirm">
        <el-input 
          v-model="registerForm.passwordConfirm" 
          type="password" 
          placeholder="再次输入密码"
          prefix-icon="el-icon-lock"
          show-password>
        </el-input>
      </el-form-item>
      
      <el-form-item prop="terms">
        <el-checkbox v-model="registerForm.terms">
          我已阅读并同意<a href="#" @click.prevent="showTerms">服务条款</a>和<a href="#" @click.prevent="showPrivacy">隐私政策</a>
        </el-checkbox>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="onSubmit" style="width: 100%">注册</el-button>
      </el-form-item>
      
      <div class="login-link">
        已有账户？<el-link type="primary" @click="toLogin">立即登录</el-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: "Register",
  data() {
    const validatePasswordConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
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
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在3到20个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的电子邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePasswordConfirm, trigger: 'blur' }
        ],
        terms: [
          { 
            validator: (rule, value, callback) => {
              if (value === false) {
                callback(new Error('请同意服务条款和隐私政策'));
              } else {
                callback();
              }
            }, 
            trigger: 'change' 
          }
        ]
    }
  }
},
  methods: {
    ...mapActions('auth', ['register']),
    
    onSubmit() {
      this.validateForm();
      // 如果有错误，则不提交
      if (Object.values(this.errors).some(error => error !== '')) {
        return;
      }

      
      this.register({
        username: this.registerForm.username,
        password: this.registerForm.password,
        email: this.registerForm.email
      })
      .then(() => {
        this.showSuccess = true
        setTimeout(() => {
          this.$router.push('/home')
        }, 2000)
      })
      .catch(error => {
        // 处理错误
        this.$message.error('注册失败：' + error.message || '未知错误');
        console.error('注册失败:', error);
      })
    },
    validateForm() {
      this.errors.username = this.registerForm.username ? '' : '用户名不能为空';
      this.errors.email = this.registerForm.email ? '' : '电子邮箱不能为空';
      this.errors.password = this.registerForm.password ? '' : '密码不能为空';
      this.errors.passwordConfirm = this.registerForm.passwordConfirm === this.registerForm.password ? '' : '两次输入的密码不一致';

      // 检查是否同意条款
      if (!this.registerForm.terms) {
        this.$message({
          message: '请您勾选同意服务条款和隐私政策后再进行注册',
          type: 'warning',
          duration: 3000,
          showClose: true
        });
        return false;
      }
    },
    toLogin() {
      this.$router.push('/login')
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
    background: linear-gradient(135deg, #e0f7fa, #bbdefb, #81d4fa);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  
  .container {
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(66, 133, 244, 0.2);
    width: 100%;
    max-width: 450px;
    padding: 40px;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
  }
  
  .container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    background: linear-gradient(90deg, #4fc3f7, #29b6f6, #03a9f4);
  }
  
  h1 {
    color: #0288d1;
    font-size: 32px;
    text-align: center;
    margin-bottom: 30px;
    letter-spacing: 1px;
  }

  .login-link {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #0288d1;
  }
  
  .success-message {
    text-align: center;
    padding: 20px;
    background-color: #e0f7fa;
    border-radius: 10px;
    animation: fadeIn 0.5s;
    margin-bottom: 20px;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  /* Element Plus 样式覆盖 */
  .el-form-item__label {
    color: #0288d1 !important;
    font-weight: 600 !important;
    font-size: 14px !important;
  }
  
  /* 修复输入框内的淡蓝色框问题 */
  .el-input {
    --el-input-border-color: #e1f5fe !important;
    --el-input-hover-border-color: #03a9f4 !important;
    --el-input-focus-border-color: #03a9f4 !important;
  }
  
  .el-input__wrapper {
    box-shadow: 0 0 0 1px #e1f5fe !important;
    border-radius: 10px !important;
    padding: 0 15px !important;
    height: 45px !important;
    transition: all 0.3s ease !important;
    background-color: transparent !important;
  }
  
  .el-input__wrapper.is-focus {
    box-shadow: 0 0 0 1px #03a9f4, 0 0 0 3px rgba(3, 169, 244, 0.2) !important;
  }
  
  /* 移除原来可能导致问题的样式 */
  .el-input__inner {
    height: 45px !important;
    border: none !important;
    background: transparent !important;
  }
  
  .el-input__prefix {
    color: #4fc3f7 !important;
    font-size: 18px !important;
    left: 15px !important;
  }
  
  .el-button--primary {
    background: linear-gradient(90deg, #0288d1, #039be5) !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 16px !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    letter-spacing: 1px !important;
    transition: all 0.3s ease !important;
  }
  
  .el-button--primary:hover {
    background: linear-gradient(90deg, #0277bd, #0288d1) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 7px 14px rgba(2, 136, 209, 0.3) !important;
  }
  
  .el-checkbox__label {
    font-size: 14px !important;
  }
  
  .el-checkbox__label a {
    color: #01579b !important;
    text-decoration: none !important;
  }
  
  .el-checkbox__label a:hover {
    text-decoration: underline !important;
  }
  
  .el-link {
    font-weight: 600 !important;
    margin-left: 5px !important;
  }
  
  .el-link:hover {
    text-decoration: underline !important;
  }
  
  .el-form-item {
    margin-bottom: 25px !important;
  }
  
  @media (max-width: 500px) {
    .container {
      padding: 30px 20px;
    }
    
    h1 {
      font-size: 26px;
    }
  }
</style>
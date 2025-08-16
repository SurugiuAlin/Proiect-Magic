<template>
  <div class="container">
    <div class="form-container">
      <h1 class="form-title">Welcome Back</h1>
      <p class="form-subtitle">Sign in to your account</p>
      
      <div class="card">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              v-model="formData.username"
              required
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              required
              :disabled="loading"
            />
          </div>
          
          <div v-if="error" class="error">{{ error }}</div>
          
          <button 
            type="submit" 
            class="btn" 
            :disabled="loading"
            style="width: 100%"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
      
      <div class="form-footer">
        Don't have an account? <router-link to="/register">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '../apiService';

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      error: '',
      loading: false
    }
  },
  methods: {
    async handleSubmit() {
      this.error = '';
      this.loading = true;

      try {
        const data = await authAPI.login(this.formData);

        if (data.success) {
          this.$emit('login', data.data.token, data.data.username);
          this.$router.push('/dashboard');
        } else {
          this.error = data.message || 'Login failed';
        }
      } catch (error) {
        this.error = 'An error occurred. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script> 
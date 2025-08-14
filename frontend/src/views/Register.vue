<template>
  <div class="container">
    <div class="form-container">
      <h1 class="form-title">Create Account</h1>
      <p class="form-subtitle">Join us and explore League of Legends data</p>
      
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
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
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
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.confirmPassword"
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
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
      </div>
      
      <div class="form-footer">
        Already have an account? <router-link to="/login">Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      formData: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      error: '',
      loading: false
    }
  },
  methods: {
    validateForm() {
      if (this.formData.password !== this.formData.confirmPassword) {
        this.error = 'Passwords do not match';
        return false;
      }
      
      if (this.formData.password.length < 6) {
        this.error = 'Password must be at least 6 characters long';
        return false;
      }
      
      if (!this.formData.email.includes('@')) {
        this.error = 'Please enter a valid email address';
        return false;
      }
      
      return true;
    },
    
    async handleSubmit() {
      this.error = '';
      
      if (!this.validateForm()) {
        return;
      }
      
      this.loading = true;

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.formData.username,
            email: this.formData.email,
            password: this.formData.password
          })
        });

        const data = await response.json();

        if (data.success) {
          this.$emit('login', data.token, data.username);
          this.$router.push('/dashboard');
        } else {
          this.error = data.message || 'Registration failed';
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
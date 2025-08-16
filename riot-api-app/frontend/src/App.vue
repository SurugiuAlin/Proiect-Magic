<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="nav-brand">Riot API App</router-link>
        <div class="nav-links">
          <template v-if="isAuthenticated">
            <span class="welcome">Welcome, {{ username }}!</span>
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <button @click="logout" class="btn btn-secondary">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">Login</router-link>
            <router-link to="/register" class="nav-link">Register</router-link>
          </template>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view @login="handleLogin" @logout="handleLogout" />
    </main>
  </div>
</template>

<script>
import { isAuthenticated, getUsernameFromToken, isTokenExpired, setToken, removeToken } from './authHelper.js'

export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false,
      username: ''
    }
  },
  mounted() {
    this.checkAuthStatus()
  },
  methods: {
    checkAuthStatus() {
      if (isAuthenticated() && !isTokenExpired()) {
        const username = getUsernameFromToken()
        if (username) {
          this.isAuthenticated = true
          this.username = username
        } else {
          this.logout()
        }
      } else {
        this.logout()
      }
    },
    handleLogin(token, username) {
      this.isAuthenticated = true
      this.username = username
      setToken(token)
    },
    handleLogout() {
      this.logout()
    },
    logout() {
      this.isAuthenticated = false
      this.username = ''
      removeToken()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.navbar {
  background: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-link:hover {
  background: #f8f9fa;
}

.welcome {
  color: #666;
  padding: 0.5rem 1rem;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.btn:hover {
  background: #5a6268;
}
</style> 
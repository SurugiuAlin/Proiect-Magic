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
import {
  isAuthenticated,
  getUsernameFromToken,
  isTokenExpired,
  setToken,
  removeToken
} from './authHelper.js'

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
#app {
  min-height: 100vh;
  background: radial-gradient(circle at top left, #7f5af0, #4433a9 35%, #1e1b4b 80%);
  color: #0f172a;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* NAVBAR */

.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(16px);
  background: linear-gradient(
    to right,
    rgba(15, 23, 42, 0.45),
    rgba(30, 64, 175, 0.3)
  );
  border-bottom: 1px solid rgba(148, 163, 184, 0.4);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.85rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #e5e7eb;
  text-decoration: none;
}

.nav-brand:hover {
  color: #ffffff;
}

.nav-links {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.nav-link {
  color: #e5e7eb;
  text-decoration: none;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.95rem;
  transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease;
}

.nav-link:hover {
  background: rgba(15, 23, 42, 0.65);
  transform: translateY(-1px);
}

.welcome {
  color: #cbd5f5;
  font-size: 0.95rem;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.55);
}

/* MAIN */

.main-content {
  max-width: 1200px;
  margin: 2.5rem auto 3rem;
  padding: 0 1.75rem 3rem;
}

/* BUTTONS */

.btn {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  font-size: 0.95rem;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.35);
  transition: background 0.2s ease, transform 0.12s ease, box-shadow 0.2s ease,
    opacity 0.15s ease;
}

.btn:disabled {
  opacity: 0.7;
  cursor: default;
  box-shadow: none;
  transform: none;
}

.btn-secondary {
  background: linear-gradient(to right, #6b7280, #4b5563);
  color: #f9fafb;
}

.btn-secondary:hover:not(:disabled) {
  background: linear-gradient(to right, #4b5563, #374151);
  transform: translateY(-1px);
  box-shadow: 0 16px 35px rgba(15, 23, 42, 0.4);
}

@media (max-width: 640px) {
  .nav-content {
    padding-inline: 1.1rem;
  }

  .welcome {
    display: none;
  }
}
</style>

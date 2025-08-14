<template>
  <div class="container">
    <div class="home-content">
      <h1 class="home-title">Welcome to Riot API App</h1>
      <p class="home-subtitle">Search for League of Legends summoners and view their information</p>
      
      <div class="home-actions">
        <router-link to="/login" class="btn">Sign In</router-link>
        <router-link to="/register" class="btn btn-secondary">Create Account</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home-content {
  text-align: center;
  color: white;
}

.home-title {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: 300;
}

.home-subtitle {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.home-actions {
  margin-bottom: 60px;
}

.home-actions .btn {
  margin: 0 10px;
  text-decoration: none;
  display: inline-block;
}

.home-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.feature-card h3 {
  margin-bottom: 15px;
  font-size: 20px;
}

.feature-card p {
  opacity: 0.8;
  line-height: 1.6;
}
</style> 
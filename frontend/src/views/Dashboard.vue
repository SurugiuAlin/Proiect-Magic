<template>
  <div class="container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Riot ID Search</h1>
      <p class="dashboard-subtitle">Find PUUID by Riot ID (gameName#tagLine)</p>
    </div>

    <div class="card">
      <h2 class="section-title">Search Account</h2>
      <div class="search-form">
        <input type="text" placeholder="Summoner Name" v-model.trim="gameName" required />
        <input type="text" placeholder="Tag" v-model.trim="tagLine" required style="max-width: 180px" />
        <select v-model="region">
          <option value="europe">Europe</option>
          <option value="americas">Americas</option>
          <option value="asia">Asia</option>
          <option value="sea">SEA</option>
        </select>
      </div>

      <button class="btn" @click="search" :disabled="loading" style="width: 100%">
        {{ loading ? 'Searching...' : 'Search Riot ID' }}
      </button>

      <div v-if="error" class="error" style="marginTop: '15px'">{{ error }}</div>
    </div>

    <div v-if="loading" class="loading">Searching account...</div>

    <div v-if="result" class="card">
      <h3>Account Info</h3>
      <div class="data-display">
        <div class="data-item"><span class="data-label">puuid:</span><span class="data-value">{{ result.data.puuid }}</span></div>
        <div class="data-item"><span class="data-label">gameName:</span><span class="data-value">{{ result.data.gameName }}</span></div>
        <div class="data-item"><span class="data-label">tagLine:</span><span class="data-value">{{ result.data.tagLine }}</span></div>
      </div>
      <div class="data-display">
        <div class="data-item"><span class="data-label">Region:</span><span class="data-value">{{ result.region }}</span></div>
        <div class="data-item"><span class="data-label">Riot ID:</span><span class="data-value">{{ result.gameName }}#{{ result.tagLine }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      gameName: '',
      tagLine: '',
      region: 'europe',
      result: null,
      loading: false,
      error: ''
    }
  },
  methods: {
    buildUrl() {
      const p = new URLSearchParams({ gameName: this.gameName, tagLine: this.tagLine, region: this.region })
      return `/api/account/by-riot-id?${p.toString()}`
    },
    async search() {
      this.error = ''
      this.result = null
      if (!this.gameName || !this.tagLine) {
        this.error = 'Please enter both gameName and tagLine'
        return
      }
      this.loading = true
      try {
        const res = await fetch(this.buildUrl())
        if (!res.ok) throw new Error(await res.text())
        this.result = await res.json()
      } catch (e) {
        this.error = e.message || 'Failed to fetch data'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.section-title { color: white; margin-bottom: 15px; font-size: 20px; }
</style> 
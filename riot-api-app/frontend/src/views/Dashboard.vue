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
    </div>

    <div v-if="result?.data?.championMastery?.length" class="card">
      <h3>Top Champion Masteries</h3>
      <div class="mastery-list">
        <div class="mastery-item" v-for="champ in result.data.championMastery" :key="champ.championId">
          <div class="mastery-left">
            <img v-if="champ.championIcon" :src="champ.championIcon" :alt="champ.championName" class="champion-icon" />
          </div>
          <div class="mastery-info">
            <div class="data-item"><span class="data-label">Champion:</span><span class="data-value">{{ champ.championName }} ({{ champ.championId }})</span></div>
            <div class="data-item"><span class="data-label">Level:</span><span class="data-value">{{ champ.championLevel }}</span></div>
            <div class="data-item"><span class="data-label">Points:</span><span class="data-value">{{ champ.championPoints.toLocaleString() }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { accountAPI } from '../apiService';

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
    async search() {
      this.error = ''
      this.result = null
      if (!this.gameName || !this.tagLine) {
        this.error = 'Please enter both gameName and tagLine'
        return
      }
      this.loading = true
      try {
        this.result = await accountAPI.searchByRiotId(this.gameName, this.tagLine, this.region)
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
.mastery-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
.mastery-item { display: flex; gap: 16px; align-items: center; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
.champion-icon { width: 72px; height: 72px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.6); object-fit: cover; box-shadow: 0 6px 18px rgba(0,0,0,0.3); }
.mastery-info { flex: 1; }
</style> 
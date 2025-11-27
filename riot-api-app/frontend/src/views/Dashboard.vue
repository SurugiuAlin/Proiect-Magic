<template>
  <div class="container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Riot ID Search</h1>
      <p class="dashboard-subtitle">Find PUUID by Riot ID (gameName#tagLine)</p>
    </div>

    <div class="card">
      <h2 class="section-title">Search Account</h2>

      <div class="search-form">
        <input
          type="text"
          placeholder="Summoner Name"
          v-model.trim="gameName"
          required
        />
        <input
          type="text"
          placeholder="Tag"
          v-model.trim="tagLine"
          required
          class="input-tag"
        />
        <select v-model="region">
          <option value="europe">Europe</option>
          <option value="americas">Americas</option>
          <option value="asia">Asia</option>
          <option value="sea">SEA</option>
        </select>
      </div>

      <button class="btn btn-primary btn-full" @click="search" :disabled="loading">
        {{ loading ? "Searching..." : "Search Riot ID" }}
      </button>

      <div v-if="error" class="error">{{ error }}</div>
    </div>

    <div v-if="loading" class="loading">Searching account...</div>

    <div v-if="result" class="card">
      <h3 class="card-title">Account Info</h3>

      <div class="account-info">
        <div
          class="account-icon"
          v-if="result.data.summonerProfile?.profileIconUrl"
        >
          <img
            :src="result.data.summonerProfile.profileIconUrl"
            :alt="result.data.summonerProfile?.name || result.data.gameName"
          />
          <span class="account-level">
            Level {{ result.data.summonerProfile?.summonerLevel ?? "—" }}
          </span>
        </div>

        <div class="data-display">
          <div class="data-item">
            <span class="data-label">puuid:</span>
            <span class="data-value data-value-mono">{{ result.data.puuid }}</span>
          </div>

          <div class="data-item">
            <span class="data-label">gameName:</span>
            <span class="data-value">{{ result.data.gameName }}</span>
          </div>

          <div class="data-item">
            <span class="data-label">tagLine:</span>
            <span class="data-value">{{ result.data.tagLine }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="result?.data?.championMastery?.length" class="card">
      <h3 class="card-title">Top Champion Masteries</h3>

      <div class="mastery-list">
        <div
          class="mastery-item"
          v-for="champ in result.data.championMastery"
          :key="champ.championId"
        >
          <img
            v-if="champ.championIcon"
            :src="champ.championIcon"
            :alt="champ.championName"
            class="champion-icon"
          />

          <div class="mastery-info">
            <div class="data-item">
              <span class="data-label">Champion:</span>
              <span class="data-value">
                {{ champ.championName }} ({{ champ.championId }})
              </span>
            </div>
            <div class="data-item">
              <span class="data-label">Level:</span>
              <span class="data-value">{{ champ.championLevel }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">Points:</span>
              <span class="data-value">
                {{ champ.championPoints.toLocaleString() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { accountAPI } from "../apiService";

export default {
  name: "Dashboard",
  data() {
    return {
      gameName: "",
      tagLine: "",
      region: "europe",
      result: null,
      loading: false,
      error: "",
    };
  },
  methods: {
    async search() {
      this.error = "";
      this.result = null;

      if (!this.gameName || !this.tagLine) {
        this.error = "Please enter both gameName and tagLine";
        return;
      }

      this.loading = true;

      try {
        this.result = await accountAPI.searchByRiotId(
          this.gameName,
          this.tagLine,
          this.region
        );
      } catch (e) {
        this.error = e.message || "Failed to fetch data";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto 3rem;
  padding: 0 0 3rem;
}

/* HEADER */
.dashboard-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.dashboard-title {
  font-size: 2.1rem;
  font-weight: 700;
  color: #f9fafb;
}

.dashboard-subtitle {
  margin-top: 0.4rem;
  font-size: 0.97rem;
  color: #c7d2fe;
}

/* CARD */
.card {
  background: rgba(10, 15, 35, 0.9);
  border-radius: 22px;
  padding: 1.75rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 1.75rem;
}

/* FIXED TITLE COLORS */
.card-title {
  color: #e5e7eb !important;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-title {
  color: #e5e7eb;
  margin-bottom: 1rem;
  font-size: 1.15rem;
  font-weight: 600;
}

/* SEARCH FORM */
.search-form {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.search-form input,
.search-form select {
  padding: 0.65rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e5e7eb;
}

.input-tag {
  max-width: 180px;
}

/* BUTTONS */
.btn {
  border: none;
  border-radius: 12px;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
}

.btn-primary {
  width: 100%;
  background: linear-gradient(to right, #4f46e5, #2563eb);
  color: white;
}

/* ERROR & LOADING */
.error {
  margin-top: 1rem;
  padding: 0.6rem;
  border-radius: 10px;
  color: #fecaca;
  border: 1px solid rgba(248, 113, 113, 0.4);
  background: rgba(220, 38, 38, 0.1);
}

.loading {
  text-align: center;
  color: white;
  margin-bottom: 1rem;
}

/* ACCOUNT INFO */
.account-info {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.account-icon img {
  width: 90px;
  height: 90px;
  border-radius: 14px;
  border: 2px solid gold;
}

.account-level {
  margin-top: 0.3rem;
  background: gold;
  padding: 2px 10px;
  border-radius: 999px;
  color: black;
  font-weight: bold;
}

/* FIX WHITE BOX */
.data-display {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  padding: 1rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.data-item {
  margin-bottom: 0.45rem;
}

.data-label {
  color: #cbd5e1;
  font-weight: 600;
}

.data-value {
  color: #f8fafc;
}

.data-value-mono {
  font-family: monospace;
}

/* MASTERY */
.mastery-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mastery-item {
  display: flex;
  padding: 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.champion-icon {
  width: 70px;
  height: 70px;
  border-radius: 999px;
  border: 2px solid #6366f1;
  margin-right: 1rem;
}
</style>

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const championCache = {
  version: null,
  data: null,
  fetchedAt: 0
};

async function fetchChampionData() {
  const versionsRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  if (!versionsRes.ok) {
    throw new Error(`Failed to load Data Dragon versions (${versionsRes.status})`);
  }

  const versions = await versionsRes.json();
  const latestVersion = versions[0];

  const championsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
  if (!championsRes.ok) {
    throw new Error(`Failed to load champion data (${championsRes.status})`);
  }

  const champions = await championsRes.json();
  const map = {};
  Object.values(champions.data).forEach((champion) => {
    map[String(champion.key)] = {
      name: champion.name,
      alias: champion.id,
      image: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champion.image.full}`
    };
  });

  championCache.version = latestVersion;
  championCache.data = map;
  championCache.fetchedAt = Date.now();

  return map;
}

async function getChampionMap() {
  const isFresh = championCache.data && Date.now() - championCache.fetchedAt < DAY_IN_MS;
  if (isFresh) {
    return championCache.data;
  }

  return fetchChampionData();
}

async function getChampionInfo(championId) {
  try {
    const map = await getChampionMap();
    const data = map[String(championId)];
    if (!data) {
      return { name: `Champion ${championId}`, icon: null };
    }
    return {
      name: data.name,
      icon: data.image
    };
  } catch (error) {
    console.error('Champion info lookup failed:', error.message);
    return { name: `Champion ${championId}`, icon: null };
  }
}

module.exports = { getChampionInfo };


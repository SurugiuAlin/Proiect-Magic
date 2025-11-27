const express = require('express');
const router = express.Router();
const { jsonResponse, normalizeRegionalHost, normalizePlatformHost } = require('../utils');
const checkLogin = require('../checkLogin');
const { getChampionInfo } = require('../championService');

router.use(checkLogin);

router.get('/by-riot-id', checkLogin, async (req, res) => {
	try {
		const { gameName, tagLine } = req.query;
		const regionalHost = normalizeRegionalHost(req.query.region);
		
		if (!gameName || !tagLine) {
			return jsonResponse(res, false, 400, [], 'Required: gameName and tagLine');
		}

		const url = `https://${regionalHost}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

		const response = await fetch(url, {
			headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
		});
		if (!response.ok) {
			return jsonResponse(res, false, response.status, [], 'Account not found');
		}

		const data = await response.json();

		let championMastery = [];
		try {
			const platformHost = normalizePlatformHost(tagLine);
			const masteryUrl = `https://${platformHost}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(data.puuid)}?count=3`;
			const masteryResponse = await fetch(masteryUrl, {
				headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
			});

			if (masteryResponse.ok) {
				const masteryData = await masteryResponse.json();
				const topChampions = masteryData.slice(0, 3);

				championMastery = await Promise.all(topChampions.map(async (mastery) => {
					const info = await getChampionInfo(mastery.championId);
					return {
						championId: mastery.championId,
						championName: info.name,
						championIcon: info.icon,
						championPoints: mastery.championPoints,
						championLevel: mastery.championLevel,
						lastPlayTime: mastery.lastPlayTime
					};
				}));
			}
		} catch (masteryError) {
			console.error('Champion mastery fetch failed:', masteryError.message);
		}

		const responseData = {
			...data,
			region: regionalHost,
			gameName,
			tagLine,
			championMastery
		};

		return jsonResponse(res, true, 200, responseData, 'Account found successfully');
	} catch (error) {
		const riotStatus = error.response?.data?.status;
		const message = riotStatus?.message || error.message || 'Upstream error';
		return jsonResponse(res, false, 500, [], message);
	}
});

module.exports = router; 
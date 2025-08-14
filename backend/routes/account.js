const express = require('express');
const axios = require('axios');
const router = express.Router();

const REGIONAL_ALIAS = {
	eu: 'europe', euw: 'europe', euw1: 'europe', eun: 'europe', eun1: 'europe', eune: 'europe', eune1: 'europe', tr1: 'europe', ru: 'europe',
	na: 'americas', na1: 'americas', br1: 'americas', la1: 'americas', la2: 'americas', oce: 'americas', oc1: 'americas',
	kr: 'asia', jp1: 'asia',
	europe: 'europe', americas: 'americas', asia: 'asia', sea: 'sea'
};

function normalizeRegionalHost(input) {
	const key = String(input || 'europe').toLowerCase();
	return REGIONAL_ALIAS[key] || 'europe';
}

router.get('/by-riot-id', async (req, res) => {
	try {
		const gameName = String(req.query.gameName || '').trim();
		const tagLine = String(req.query.tagLine || '').trim();
		if (!gameName || !tagLine) {
			return res.status(400).json({ success: false, error: 'Required: gameName and tagLine' });
		}

		const regionalHost = normalizeRegionalHost(req.query.region);
		const url = `https://${regionalHost}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

		const response = await axios.get(url, {
			headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
		});

		return res.json({ success: true, data: response.data, region: regionalHost, gameName, tagLine });
	} catch (error) {
		const riotStatus = error.response?.data?.status;
		const message = riotStatus?.message || error.message || 'Upstream error';
		const status = riotStatus?.status_code || error.response?.status || 502;
		return res.status(status).json({ success: false, error: message });
	}
});

module.exports = router; 
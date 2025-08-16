const express = require('express');
const router = express.Router();
const { jsonResponse, normalizeRegionalHost } = require('../utils');
const checkLogin = require('../checkLogin');
const { REGIONAL_ALIAS } = require('../constants');

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

		const responseData = {
			...data,
			region: regionalHost,
			gameName,
			tagLine
		};

		return jsonResponse(res, true, 200, responseData, 'Account found successfully');
	} catch (error) {
		const riotStatus = error.response?.data?.status;
		const message = riotStatus?.message || error.message || 'Upstream error';
		return jsonResponse(res, false, 500, [], message);
	}
});

module.exports = router; 
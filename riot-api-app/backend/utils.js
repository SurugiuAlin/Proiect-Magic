const jwt = require('jsonwebtoken');
const { REGIONAL_ALIAS } = require('./constants');

function jsonResponse(res, success, status, data = [], message) {
  const response = { success, message }
  response.data = data;

  return res.status(status).json(response);
}

function generateJWT(payload, expiresIn = '24h') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function normalizeRegionalHost(input, tagLine = '') {
  const key = String(input || 'europe').toLowerCase();
  const region = REGIONAL_ALIAS[key];
  
  if (!region) {
    throw new Error(`Invalid region: ${input}`);
  }
  
  if (tagLine) {
    const tagUpper = tagLine.toUpperCase();
    
    if (['EUNE', 'EUW', 'EU', 'TR', 'RU'].includes(tagUpper) && region !== 'europe') {
      throw new Error(`${tagUpper} accounts can only be searched in Europe region`);
    }
    
    if (['NA', 'BR', 'LA1', 'LA2', 'OCE'].includes(tagUpper) && region !== 'americas') {
      throw new Error(`${tagUpper} accounts can only be searched in Americas region`);
    }
    
    if (['KR', 'JP'].includes(tagUpper) && region !== 'asia') {
      throw new Error(`${tagUpper} accounts can only be searched in Asia region`);
    }

    if (['SEA'].includes(tagUpper) && region !== 'sea') {
      throw new Error(`${tagUpper} accounts can only be searched in SEA region`);
    }
  }
  
  return region;
}

module.exports = { jsonResponse, generateJWT, normalizeRegionalHost }

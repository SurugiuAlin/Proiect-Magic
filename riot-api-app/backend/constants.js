const REGIONAL_ALIAS = {
    eu: 'europe', 
    euw: 'europe', 
    euw1: 'europe', 
    eun: 'europe', 
    eun1: 'europe', 
    eune: 'europe', 
    eune1: 'europe', 
    tr1: 'europe', 
    ru: 'europe',
    
    na: 'americas', 
    na1: 'americas', 
    br1: 'americas', 
    la1: 'americas', 
    la2: 'americas', 
    oce: 'americas', 
    oc1: 'americas',
    
    kr: 'asia', 
    jp1: 'asia',
    
    europe: 'europe', 
    americas: 'americas', 
    asia: 'asia', 
    sea: 'sea'
};

const PLATFORM_ALIAS = {
    euw: 'euw1',
    euw1: 'euw1',
    eu: 'euw1',
    eune: 'eun1',
    eun: 'eun1',
    eun1: 'eun1',
    eune1: 'eun1',
    tr: 'tr1',
    tr1: 'tr1',
    ru: 'ru',
    na: 'na1',
    na1: 'na1',
    br: 'br1',
    br1: 'br1',
    lan: 'la1',
    la1: 'la1',
    las: 'la2',
    la2: 'la2',
    oce: 'oc1',
    oc1: 'oc1',
    kr: 'kr',
    jp: 'jp1',
    jp1: 'jp1',
    sea: 'sea',
    sg: 'sea',
    ph: 'sea',
    th: 'sea',
    vn: 'sea',
    tw: 'sea',
    hk: 'sea'
};

module.exports = { REGIONAL_ALIAS, PLATFORM_ALIAS };
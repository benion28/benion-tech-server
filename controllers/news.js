const axios = require('axios')

const cryptoApiBaseUrl = process.env.CRYPTO_RAPIDAPI_URL
const newsApibaseUrl = process.env.NEWS_API_URL

const cryptoApiHeaders = {
    'x-rapidapi-host': process.env.CRYPTO_RAPIDAPI_HOST,
    'x-rapidapi-key': process.env.CRYPTO_RAPIDAPI_KEY
}

const newsApiHeaders = {
    'x-bingapis-sdk': 'true',
    'x-rapidapi-host': process.env.NEWS_API_HOST,
    'x-rapidapi-key': process.env.NEWS_API_KEY
}

// Get All Cryptos
const getCryptos = async (request, response) => {
	let count;
	if (request.body.count === undefined) {
		count = 100
	} else {
		count = request.body.count
	}

    try {
        const cryptos = await axios({ url: `/coins?limit=${ count }`, method: 'get', baseURL: cryptoApiBaseUrl, headers: cryptoApiHeaders })
        console.log(`All ${ cryptos.data.data.coins.length } Cryptos Fetched Successfully`)
        return response.status(200).json({
            success: true,
            message: `All ${ cryptos.data.data.coins.length } Cryptos Fetched Successfully`,
			count: cryptos.data.data.coins.length,
            data: cryptos.data.data
        })
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

// Get A Crypto
const getCrypto = async (request, response) => {
	let id
	
	if (request.params.id === undefined) {
		id = "Qwsogvtv82FCd"
	} else {
		id = request.params.id
	}

    try {
        const crypto = await axios({ url: `/coin/${ id }`, method: 'get', baseURL: cryptoApiBaseUrl, headers: cryptoApiHeaders })
        console.log(`Crypto (${ crypto.data.data.coin.name.toUpperCase() }) Fetched Successfully`)
        return response.status(200).json({
            success: true,
            message: `Crypto (${ crypto.data.data.coin.name.toUpperCase() }) Fetched Successfully`,
            data: crypto.data.data.coin
        })
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

// Get A Crypto History
const getCryptoHistory = async (request, response) => {
	let id
	let timePeriod
	
	if (request.body.id === undefined) {
		id = "Qwsogvtv82FCd"
	} else {
		id = request.body.id
	}
	
	if (request.body.timePeriod === undefined) {
		timePeriod = "7d"
	} else {
		timePeriod = request.body.timePeriod
	}

    try {
        const cryptoHistory = await axios({ url: `/coin/${ id }/history`, params: { timePeriod }, method: 'get', baseURL: cryptoApiBaseUrl, headers: cryptoApiHeaders })
        console.log(`${ cryptoHistory.data.data.history.length } Crypto Histories Fetched Successfully`)
        return response.status(200).json({
            success: true,
            message: `${ cryptoHistory.data.data.history.length } Crypto Histories Fetched Successfully`,
            count: cryptoHistory.data.data.history.length,
            data: cryptoHistory.data.data
        })
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

// Get Crypto Exchanges
const getCryptoExchanges = async (request, response) => {
    try {
        const cryptoExchanges = await axios({ url: "/exchanges", method: 'get', baseURL: cryptoApiBaseUrl, headers: cryptoApiHeaders })
        console.log("Crypto Exchanges Fetched Successfully", cryptoExchanges)
        return response.status(200).json({
            success: true,
            message: "Crypto Exchanges Fetched Successfully",
            data: cryptoExchanges
        })
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

// Get All News
const getBingNews = async (request, response) => {
    const count = request.body.count
    
    try {
        const news = await axios({ url: `/news?limit=${ count }`, method: 'get', baseURL: newsApibaseUrl, headers: newsApiHeaders })
        console.log(`All ${ news.data.value.length } News Fetched Successfully`)
        return response.status(200).json({
            success: true,
            message: `All ${ news.data.value.length } News Fetched Successfully`,
            count: news.data.value.length,
            data: news.data
        })
    } catch (error) {
		console.log(error)
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

// Get All Crypto News
const getCyptoNews = async (request, response) => {
	let count
	let newsCategory
	
	if (request.body.count === undefined) {
		count = 100
	} else {
		count = request.body.count
	}
	
	if (request.body.newsCategory === undefined) {
		newsCategory = "crypto"
	} else {
		newsCategory = request.body.newsCategory
	}
	
    try {
        const cryptoNews = await axios({ url: `/news/search?q=${ newsCategory }&safeSearch=Off&textFormat=Raw&freshness=Day&count=${ count }`, method: 'get', baseURL: newsApibaseUrl, headers: newsApiHeaders })
        console.log(`All ${ cryptoNews.data.value.length } Crypto News Fetched Successfully`)
        return response.status(200).json({
            success: true,
            message: `All ${ cryptoNews.data.value.length } Crypto News Fetched Successfully`,
            count: cryptoNews.data.value.length,
            data: cryptoNews.data
        })
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

module.exports = {
    getCryptos,
    getCrypto,
    getCryptoHistory,
    getCryptoExchanges,
    getBingNews,
    getCyptoNews
}
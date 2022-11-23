const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const axios = require('axios')
const workerpool = require('workerpool')
const fs = require('fs')
const http = require('http')

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));


const getAllPlayers = async () => {
	let allplayers = await axios.get('https://api.sleeper.app/v1/players/nfl', { timeout: 3000 })
	let ap = JSON.stringify(allplayers.data)
	fs.writeFileSync('../client/src/allPlayers.json', ap)
}
getAllPlayers()
setInterval(getAllPlayers, 1000 * 60 * 60 * 24)

app.get('/allplayers', async (req, res) => {
	getAllPlayers()
})

app.get('/dynastyvalues', async (req, res) => {
	const pool = workerpool.pool(__dirname + '/workerDV.js')
	const result = await pool.exec('getDynastyValues')
	res.send(result)
})

app.get('/leagues', async (req, res) => {
	const season = req.query.season
	const poolLeagues = workerpool.pool(__dirname + '/workerLeagues.js')
	const result = await poolLeagues.exec('getLeagues', [season])
	res.send(result)
})

app.get('/standings', async (req, res) => {
	const season = req.query.season
	const poolLeagues = workerpool.pool(__dirname + '/workerStandings.js')
	const result = await poolLeagues.exec('getStandings', [season])
	res.send(result)
})

app.get('/drafts', async (req, res) => {
	const season = req.query.season
	const poolDrafts = workerpool.pool(__dirname + '/workerDrafts.js')
	const result = await poolDrafts.exec('getDrafts', [season])
	res.send(result)
})
app.get('/transactions', async (req, res) => {
	const season = req.query.season
	const poolTransactions = workerpool.pool(__dirname + '/workerTransactions.js')
	const result = await poolTransactions.exec('getTransactions', [season])
	res.send(result)
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`server running on port ${port}`);
});
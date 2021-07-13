const express = require("express");
const app = express();
const { Pool } = require('pg');
const axios = require('axios')
const cheerio = require('cheerio')

const pool = new Pool({
    connectionString: "postgres://ikfkvlxfucqqoz:ac55631aaa353b571c22219bbe578a173188ae9a6dcd9db7cfbe8e3f2ac10c9e@ec2-34-204-128-77.compute-1.amazonaws.com:5432/dfl2ud6092sp5c",
    ssl: {
        rejectUnauthorized: false
    }
})

app.get("/", (req,res)=>{
    const name = "Jayash Bhandary"
    res.json({ name });
});


app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      res.json(result.rows)
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
});

app.get('/football', async (req, res) => {
    const url = 'https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1';
    
    axios(url)
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html)
        const statsTable = $('.statsTableContainer > tr');
        const topPremierLeagueScorers = [];
    
        statsTable.each(function () {
          const rank = $(this).find('.rank > strong').text();
          const playerName = $(this).find('.playerName > strong').text();
          const nationality = $(this).find('.playerCountry').text();
          const goals = $(this).find('.mainStat').text();
    
          topPremierLeagueScorers.push({
            rank,
            name: playerName,
            nationality,
            goals,
          });
        });
    
        res.json(topPremierLeagueScorers);
      })
      .catch(console.error);
});

app.get('/imdb', (req,res)=>{
  const query = req.params.query
 var options = {
   method: 'GET',
   url: 'https://imdb8.p.rapidapi.com/auto-complete',
   params: {q: 'avengers'},
   headers: {
     'x-rapidapi-key': '4f5165b78dmshc07357fd5d4f965p1de45djsn448dc4f6c63b',
     'x-rapidapi-host': 'imdb8.p.rapidapi.com'
   }
 };

 axios.request(options).then(function (response) {
   res.json(response.data)
 }).catch(function (error) {
 	console.error(error);
 });
})

app.get('/imdb/:query', (req,res)=>{
  const query = req.params.query
 var options = {
   method: 'GET',
   url: 'https://imdb8.p.rapidapi.com/auto-complete',
   params: {q: query},
   headers: {
     'x-rapidapi-key': '4f5165b78dmshc07357fd5d4f965p1de45djsn448dc4f6c63b',
     'x-rapidapi-host': 'imdb8.p.rapidapi.com'
   }
 };

 axios.request(options).then(function (response) {
   res.json(response.data)
 }).catch(function (error) {
 	console.error(error);
 });
})

app.get("/songs/:id", (req,res)=>{
    const id = req.params.id
    res.json({id})
})

app.listen(process.env.PORT || 5000);
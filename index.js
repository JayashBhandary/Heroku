const express = require("express");
const app = express();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})

app.get("/", (req,res)=>{
    const name = "Jayash Bhandary"
    res.json({ name });
});


app.get('/db', async(req,res)=>{
    try{
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM test_table');
        res.json(result);
    }catch(err) {
        console.error(err);
        res.send("Error " + err)
    }
})


app.get("/songs/:id", (req,res)=>{
    const id = req.params.id
    res.json({id})
})

app.listen(process.env.PORT || 5000);
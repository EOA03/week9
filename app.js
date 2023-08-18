const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

const commonResponse = function (data, error) {
    if (error) {
        return {
            success: false,
            error: error
        }
    }

    return {
        success: true,
        data: data
    }
}

const mysqlCon = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
})

const query = (query, values)=>{
    return new Promise((resolve, reject)=>{
        mysqlCon.query(query, values, (err, result, fields)=>{
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

mysqlCon.connect((err)=>{
    if (err) throw err

    console.log("mysql successfully connected")
})

app.use(bodyParser.json())

app.get('/user', (req, res)=>{
  mysqlCon.query("select * from users", (err, result, fields) => {
      if (err) {
          console.error(err)
          res.status(500).json(commonResponse(null, "server error"))
          res.end()
          return
      }

      res.status(200).json(commonResponse(result, null))
      res.end()
  })
})

app.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id

        const dbData = await query(
            `select
                u.id,
                u.name,
                u.address,
                (
                  COALESCE(
                    SUM(
                      CASE 
                        WHEN t.type = 'income' THEN t.amount
                        ELSE 0
                      END
                      )
                    ) - 
                  COALESCE(
                    SUM(
                      CASE 
                        WHEN t.type = 'expense' THEN t.amount
                        ELSE 0
                      END
                      )
                    )
                  ) AS balance,
                  COALESCE(
                    SUM(
                      CASE 
                        WHEN t.type = 'expense' THEN t.amount
                        ELSE 0
                      END
                      )
                    ) AS expense
            from
                users as u
                left join transactions as t on u.id = t.user_id
            where
                u.id = ?
            group by
                u.id`, id)

        res.status(200).json(commonResponse(dbData[0], null))
        res.end()
    } catch (err) {
        console.error(err)
        res.status(500).json(commonResponse(null, "server error"))
        res.end()
        return
    }

})

app.get('/transaction', (req, res)=>{
  mysqlCon.query("select * from transactions", (err, result, fields)=>{
    if(err){
      console.error(err)
      res.status(500).json(commonResponse(null, "server error"))
      res.end()
      return
    }

    res.status(200).json(commonResponse(result, null))
    res.end()
  })
})

app.post('/transaction', async (req, res) => {
    try {
        const body = req.body

        const dbData = await query(
          `insert into
            transactions (type, amount, user_id)
          values
            (?, ?, ?)`,
          [body.type, body.amount, body.user_id])

        res.status(200).json(commonResponse({
            id: dbData.insertId
        }, null))
        res.end()

    } catch (err) {
        console.error(err)
        res.status(500).json(commonResponse(null, "server error"))
        res.end()
        return
    }
})

app.put('/transaction/:id', async (req, res)=>{
  try{
    const id = req.params.id
    const body = req.body
    const dbData = await query(
      `update
        transactions
      set
        type = ?, amount = ?, user_id = ?
      where
        id = ?`,
      [body.type, body.amount, body.user_id, id]
    )
    res.status(200).json(commonResponse({
      id: id
    }, null))
    res.end()
  } catch(err){
    console.error(err)
    res.status(500).json(commonResponse(null, "server error"))
    res.end()
    return
  }
})

app.delete('/transaction/:id', async (req, res)=>{
    try {
        const id = req.params.id
        const data = await query("select id from transactions where id = ?", id)
        if (Object.keys(data).length === 0) {
            res.status(404).json(commonResponse(null, "data not found"))
            res.end()
            return
        }
        await query("delete from transactions where id = ?", id)

        res.status(200).json(commonResponse({
            id: id
        }, null))
        res.end()

    } catch (err) {
        console.error(err)
        res.status(500).json(commonResponse(null, "server error"))
        res.end()
        return
    }
})


app.listen(5000, () => {
    console.log("running in 5000")
})
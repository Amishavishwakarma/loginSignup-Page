var express = require('express');
var bodyParser = require("body-parser")
var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}))

const cookieParser = require("cookie-parser")
app.use(cookieParser())

const Knex = require("knex")
const connection = require("../xpresscure/knexfile")
const knex = Knex(connection["development"])

const jwt = require("jsonwebtoken");

// set the view engine to ejs
app.set('view engine', 'ejs');

// signup page

app.get('/signup', (req, res) => {
  res.render("/home/amisha/Desktop/xpresscure/views/signup.ejs");
});

app.post('/signup', async (req, res) => {
  try {
    let insertData = await knex("signup").insert({
      Name: req.body.username,
      Email: req.body.email,
      Password: req.body.psw
    })
    res.send("you have signup successfully")
  } catch (error) {
    res.send(error)
  }
});



//login page

app.get('/login', (req, res) => {
  res.render('/home/amisha/Desktop/xpresscure/views/login.ejs');
});

app.post('/login', async (req, res) => {
  try {

    let getData = await knex("signup")
      .select("*")
      .where({
        Email_id: req.body.email
      } && {
        Password: req.body.psw
      })
    if (getData.length != 0) {
      const tokon = jwt.sign({
        Email_id: req.body.email,
        Password: req.body.psw
      }, "amishavishwakarma");
      res.cookie('jwt', tokon, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000
      });
      res.send(getData)

    } else {
      res.send("you have to login first")
    }
  } catch (error) {
    res.send(error)
  }
});


//update user detail

app.get('/update', (req, res) => {
  res.render('/home/amisha/Desktop/xpresscure/views/update.ejs');
});


app.post('/update', (req, res) => {
  try {
    const tokon = req.cookies.jwt
    if (tokon) {
      jwt.verify(tokon, "amishavishwakarma", async (err, user) => {
        if (err) {
          res.sendStatus(403);

        } else {
          req.user = user;
          console.log(user)
          upadateData = await knex("signup")
            .update(req.body)
            .where({
              Email_id: req.user.Email_id
            } && {
              Password: req.user.Password
            })
          if (upadateData != 0) {
            res.send("data has been updated")
          } else {
            res.send("no such data found")
          }

        }


      });
    } else {
      res.sendStatus(401);

    }

  } catch (error) {
    res.send(error)
  }
});

app.listen(3000, () => {
  console.log("listning")
})
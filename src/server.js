require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const session = require('express-session');
const connectDatabase = require("./config/database");
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const authRoute = require('./routes/authRoute');
const managerRoute = require("./routes/managerRoute");
const buyerRoute = require("./routes/buyerRoute");
const MongoStore = require("connect-mongo").default;



app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.use(
  session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL}),
    cookie: { secure: false },
  }),
);


app.use("/auth", authRoute);
app.use('/manager', managerRoute);
app.use("/buyer", buyerRoute);


connectDatabase();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

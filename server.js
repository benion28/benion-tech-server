const path = require("path");
const { express, app, server } = require("./config/utils");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

dotenv.config({ path: "./config/config.env" });

// Passport Config
require("./config/passport")(passport);

// Cors
app.use(cors());

// Morgan
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express Session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MongoURI,
        collectionName: 'sessions',
        client: require("./modules/database")
    })
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Connect To MongoDB
const connectDatabase = require("./modules/database");
connectDatabase();

// Routes
app.use("/benion-users", require("./routes/users"));
app.use("/benion-news", require("./routes/news"));
app.use("/page-not-found", require("./routes/not-found"));

// Use Static Folder
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
    app.use(express.static("public"));
    app.get("*", (request, response) => response.sendFile(path.resolve(__dirname, "public", "index.html")));
}

const PORT = process.env.PORT || 8828;
server.listen(PORT, () => console.log(`Benion Tech Server Started In ${ process.env.NODE_ENV } Mode, On Port ${ PORT }`.yellow));

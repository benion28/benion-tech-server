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
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

dotenv.config({ path: "./config/config.env" });

// Passport Config
const googleLoginAPI = "/auth/api/google-login"
let google = false

const pageUrl = (request, response, next) => {
  const url = request.originalUrl;
  if (url === googleLoginAPI) {
    google = true
  }
  next()
}
app.use(pageUrl)

if (!google) {
    require("./config/passport")(passport)
} else {
    require("./config/passportGoogle")(passport)
}

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

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Global Variable
app.use((request, response, next) => {
    response.locals.success_message = request.flash("success_message");
    response.locals.success_delete_message = request.flash("success_delete_message");
    response.locals.error_message = request.flash("error_message");
    response.locals.error = request.flash("error");
    next();
});

// Method Override Middleware
app.use(methodOverride(function(request, response) {
    if (request.body && typeof request.body === "object" && "_method" in request.body) {
        // look in urlencoded POST bodies and delete it
        let method = request.body._method;
        delete request.body._method;
        return method;
    }
}));

// Routes
app.use("/auth", require("./routes/auth"))
app.use("/benion-users", require("./routes/users"))
app.use("/benion-cbt", require("./routes/cbt-users"))
app.use("/benion-news", require("./routes/news"))
app.use("/page-not-found", require("./routes/not-found"))

// Use Static Folder
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
    app.use(express.static("public"));
    app.get("*", (request, response) => response.sendFile(path.resolve(__dirname, "public", "index.html")));
}

const PORT = process.env.PORT || 8828;
server.listen(PORT, () => console.log(`Benion Tech Server Started In ${ process.env.NODE_ENV } Mode, On Port ${ PORT }`.yellow));

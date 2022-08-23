/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const podcastsEpisodes = require("./routes/podcasts");
const podcastsTags = require("./routes/tags");
const homeRoutes = require("./routes/home");
const responsesRoutes = require("./routes/responses");
const contributorsRoute = require("./routes/contributors");
const testRoutes = require("./routes/test")
const maintenanceRoutes = require("./routes/maintenance");

const morgan = require("morgan");

const app = express();

app.set('json spaces', 2);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/podcasts", podcastsEpisodes);
app.use("/", maintenanceRoutes);
app.use("/home", homeRoutes);
app.use("/tags", podcastsTags);
app.use("/responses", responsesRoutes);
app.use("/contributors", contributorsRoute);
app.use("/test", testRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;

import "babel-polyfill";
import express from "express";
import renderer from "./helpers/renderer";
import stream from "stream";

import createStore from "./helpers/createStore";
import { matchRoutes } from "react-router-config";
import proxy from "express-http-proxy";
import Routes from "./client/Routes";
const app = express();

const writable = new stream.Writable({
  write: function (chunk, encoding, next) {
    next();
  },
});

writable.setDefaultEncoding("utf8");

app.use(
  "/api",
  proxy("http://react-ssr-api.herokuapp.com", {
    proxyReqOptDecorator(opts) {
      opts.headers["x-forwarded-host"] = "localhost:3000";
      return opts;
    },
  })
);

app.use(express.static("public"));

app.get("*", (req, res) => {
  const store = createStore(req);

  const promises = matchRoutes(Routes, req.path)
    .map(({ route }) => {
      return route.loadData ? route.loadData(store) : null;
    })
    .map((promise) => {
      if (promise) {
        return new Promise((resolve, reject) => {
          promise.then(resolve).catch(resolve);
        });
      }
    });

  Promise.all(promises).then(() => {
    const context = {};
    const content = renderer(req, store, context);

    console.log(context);
    if (context.url) {
      return res.redirect(301, context.url);
    }
    if (context.notFound) {
      res.status(404);
    }

    res.send(content);
  });

  console.log(promises);
});

app.listen(3000, () => {
  console.log("Listing on 3000");
});

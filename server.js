const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "localhost";

const router = require("./routes");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(router);

app.listen(PORT, HOST, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("App is listening on PORT ", PORT);
});

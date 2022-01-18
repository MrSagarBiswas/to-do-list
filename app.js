const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

const items = ["Exercise", "Study", "Coding"];
const workItems = [];

// GET on Root
app.get("/", (req, res) => {
    res.render("index", { listTitle: date.getDate(), newItem: items });
})

// GET on Work
app.get("/work", (req, res) => {
    workdata = {
        listTitle: "Work items",
        newItem: workItems
    };
    res.render("index", workdata);
});

// POST
app.post("/", (req, res) => {

    if (req.body.button == "Work items") {
        if (req.body.newItem != "") {
            workItems.push(req.body.newItem);
        }
        if (req.body.newItem == "clear" || req.body.newItem == "Clear") {
            workItems = [];
        }
        res.redirect("/work");
    } else {

        if (req.body.newItem != "") {
            items.push(req.body.newItem);
        }
        if (req.body.newItem == "clear" || req.body.newItem == "Clear") {
            items = [];
        }
        res.redirect("/");
    }

});

// Listen 
const port = process.env.PORT || "3000";
app.listen(port, function () {
    console.log("Server Started on Port " + port);
})
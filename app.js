const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

// Connect with MongoDB
mongoose.connect("mongodb+srv://MrSagarBiswas:sagar123@cluster0.lhx35.mongodb.net/todoList");
const itemSchema = mongoose.Schema({
    name:
    {
        type: String,
        required: true
    }
});
const todoItem = mongoose.model("todoItem", itemSchema);

const list = mongoose.model("list", {
    name:
    {
        type: String,
        required: true
    },
    items: [itemSchema]
})

const workItems = [];
let defaultItems = [{ name: "Exercise" }, { name: "Study" }, { name: "Coding" }];

// GET on Root
app.get("/", (req, res) => {
    todoItem.find({}, (err, items) => {
        if (items.length == 0) {
            todoItem.insertMany(defaultItems);
        }
        res.render("index", { listTitle: date.getDate(), newItem: items });
    })
})


// GET on Custom Route
app.get("/:customListName", (req, res) => {
    var customListName = _.capitalize(req.params.customListName);
    if(customListName == ""){
        res.redirect("/");
    }
    list.findOne({ name: customListName }, (err, foundItem) => {
        if (!err) {
            if (!foundItem) {
                list.insertMany({ name: customListName, items: defaultItems });
                res.redirect("/" + customListName);
            }
            else {
                res.render("index", { listTitle: customListName, newItem: foundItem.items })
            }
        }
    })
});

// POST on Custom Route
app.post("/", (req, res) => {
    const customListName = req.body.list;
    const newItem = req.body.newItem;

    list.findOne({ name: customListName }, (err, foundItem) => {
        if (!foundItem) {
            todoItem.insertMany({ name: newItem });
            res.redirect("/");
        } else if (!err) {
            foundItem.items.push({ name: newItem });
            foundItem.save();
            res.redirect("/" + customListName);
        }
    })
});

// POST
// app.post("/", (req, res) => {

//     if (req.body.button == "Work items") {
//         if (req.body.newItem != "") {
//             workItems.push(req.body.newItem);
//         }
//         if (req.body.newItem == "clear" || req.body.newItem == "Clear") {
//             workItems = [];
//         }
//         res.redirect("/work");
//     } else {
//         if (req.body.newItem == "clear" || req.body.newItem == "Clear") {
//             todoItem.deleteMany().then((data) => {
//                 console.log(data);
//             });
//         }
//         else if (req.body.newItem != "") {
//             // items.push(req.body.newItem);
//             todoItem.insertMany({ name: req.body.newItem });
//         }
//         res.redirect("/");
//     }

// });

//POST on Delete
app.post("/delete", (req, res) => {
    const checkedItemID = req.body.checkbox;
    const listTitle = req.body.listTitle;
    if (date.getDate() != listTitle) {
        list.findOneAndUpdate({ name: listTitle }, { $pull: { items: { _id: checkedItemID } } }, (err) => {
            if (!err) {
                console.log("Successfully Deleted");
            }
        });
        res.redirect("/" + listTitle);
    }
    else {
        todoItem.findByIdAndRemove(checkedItemID, (err) => {
            if (!err) {
                console.log("Successfully Deleted");
            }
        });
        res.redirect("/");
    }
})


// Listen 
const port = process.env.PORT || "3000";
app.listen(port, function () {
    console.log("Server Started on Port " + port);
})
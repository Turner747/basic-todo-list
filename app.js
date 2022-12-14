require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
    process.env.DB_URI + "/todolistDB", 
    { useNewUrlParser: true }
);

const itemSchema = {
	name: {
		type: String,
		required: [true, "You cannot insert an empty list item."],
	},
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
	name: "Welcome to your To Do List!",
});

const item2 = new Item({
	name: "Hit the + button to add a new item.",
});

const item3 = new Item({
	name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
	name: String,
	items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
	const listTitle = date.getDate();

	res.redirect("/" + listTitle);
});

app.get("/:listName", (req, res) => {
	const listName = req.params.listName;

	List.findOne({ name: listName }, (err, foundList) => {
		if (err) {
			console.log(err);
			return;
		}

		if (!foundList) {
			// Create a new list
			const list = new List({
				name: listName,
				items: defaultItems,
			});

			list.save();
			res.redirect("/" + listName);
		} else {
			// Show an existing list
			res.render("list", {
				listId: foundList.id,
				listTitle: foundList.name,
				listItems: foundList.items,
			});
		}
	});
});

app.post("/add", (req, res) => {
	const item = new Item({
		name: req.body.newItem,
	});

	const listName = req.body.listName;

	List.findOne({ _id: req.body.listId }, (err, foundList) => {
		if (err) {
			console.log(err);
			return;
		}

		foundList.items.push(item);
		foundList.save();
		res.redirect("/" + listName);
	});
});

app.post("/delete", (req, res) => {
	const itemId = req.body.itemId;
	const listId = req.body.listId;
	const listName = req.body.listName;

	List.findOne({ _id: listId }, (err, foundList) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log("Successfully deleted item: " + itemId);
		foundList.items.id(itemId).remove();
		foundList.save();
		res.redirect("/" + listName);
	});
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));

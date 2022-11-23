const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["buy food", "cook food", "eat food"];
const workItems = [];

app.get("/", (req, res) => {

    const day = date.getDate();

    res.render("list", { listTitle: day, listItems: items});
});

app.post("/", (req, res) => {

    const item = req.body.newItem;

    if(req.body.list === "Work"){
        if (item) 
            workItems.push(item);
        res.redirect("/work");
    } else {
        if (item) 
            items.push(item);
        res.redirect("/");
    }
});

app.get("/work", (req, res) => {

	res.render("list", { listTitle: "Work List", listItems: workItems});
});


app.get("/about", (req, res) => {
	res.render("about");
});










app.listen(port, () => console.log(`listening on http://localhost:${port}`));

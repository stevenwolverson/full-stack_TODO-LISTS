import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  password: process.env.PG_PASS,
  database: process.env.PG_DB,
  port: process.env.PG_PORT,
});

db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

app.get("/", async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM items");
    const items = data.rows;
    console.log(items);
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const queryDB = "INSERT INTO items (title) VALUES ($1)";
  try {
    await db.query(queryDB, [item]);
    // const items = data.rows;

    // items.push({ title: item });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit", async (req, res) => {
  const editItem = req.body.updatedItemTitle;
  const itemID = req.body.updatedItemId;
  const queryDB = "UPDATE items SET title = $1 WHERE id = $2";

  try {
    await db.query(queryDB, [editItem, itemID]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async (req, res) => {
  const itemID = req.body.deleteItemId;
  const queryDB = "DELETE FROM items WHERE id = $1";
  try {
    await db.query(queryDB, [itemID]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

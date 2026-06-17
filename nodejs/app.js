const express = require("express");

const app = express();

app.use(express.json());

const contactRoutes = require("./routes/contactsRoutes");

app.use("/contacts", contactRoutes);

module.exports = app;

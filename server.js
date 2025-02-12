const express = require("express");
const path = require("path");

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Enable JSON & URL-encoded data (optional for future API expansion)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

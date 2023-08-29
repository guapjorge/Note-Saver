//import all packages needed
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
//Port location
const PORT = process.env.PORT || 3003;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//takes you to the main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
//takes you to the notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (_, data) => {
        res.json(JSON.parse(data));
    });
});
//gets ALL
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//This allows a note to be written and saved
app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        fs.readFile(`./db/db.json`, "utf8", (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedData = JSON.parse(data);
                parsedData.push(newNote);

                fs.writeFile(
                    "./db/db.json",
                    JSON.stringify(parsedData, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.log("Success!")
                );
            }
        });

        const response = {
            status: "success",
            body: newNote,
        };

        res.json(response);
    } else {
        res.json("Error");
    }
});
//This creates a route that is able to delete a note
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (_, data) => {
        console.log(data);
        const notes = JSON.parse(data);
        console.log(notes);
        const filteredNotes = notes.filter((note) => note.id !== req.params.id);
        fs.writeFileSync("./db/db.json", JSON.stringify(filteredNotes, null, 4));
        res.json(filteredNotes);
    });
});
app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});

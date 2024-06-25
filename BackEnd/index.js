const express = require("express");
const cors = require("cors");
const datas = require("./Mongo/scheme");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: ["https://frontend-omega-nine-33.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(express.json());

app.post("/datas", async (req, res) => {
    try {
        const data = await datas.findOne(); // Use findOne() instead of find() to get a single document
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Error fetching data" });
    }
});

app.post("/update", async (req, res) => {
    try {
        const update = req.body;
        await datas.updateOne({}, update);
        res.json(update);
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Error updating data" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

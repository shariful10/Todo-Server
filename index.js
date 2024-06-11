require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ObjectId } = require("mongodb");

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://todo:todo@cluster0.xogsopc.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		const db = client.db("todo");
		const taskCollection = db.collection("tasks");

		app.get("/tasks", async (req, res) => {
			let query = {};
			if (req.query.priority) {
				query.priority = req.query.priority;
			}
			const cursor = taskCollection.find(query);
			const tasks = await cursor.toArray();
			res.send({ status: true, data: tasks });
		});

		app.post("/task", async (req, res) => {
			const task = req.body;
			const result = await taskCollection.insertOne(task);
			res.send(result);
		});

		app.get("/task/:id", async (req, res) => {
			const id = req.params.id;
			const result = await taskCollection.findOne({ _id: ObjectId(id) });
			res.send(result);
		});

		app.delete("/task/:id", async (req, res) => {
			const id = req.params.id;
			const result = await taskCollection.deleteOne({ _id: ObjectId(id) });
			res.send(result);
		});

		app.get("/task/:id", async (req, res) => {
			const id = req.params.id;
			const result = await taskCollection.findOne({ _id: ObjectId(id) });
			res.send(result);
		});

		app.put("/task/:id", async (req, res) => {
			const id = req.params.id;
			const task = req.body;

			const filter = { _id: ObjectId(id) };

			const updateDoc = {
				$set: {
					status: task.status,
					title: task.title,
					description: task.description,
					dateTime: task.dateTime,
					priority: task.priority,
				},
			};

			const result = await taskCollection.updateOne(filter, updateDoc);
			res.send(result);
		});

		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
	}
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(port, () => {
	console.log(`App is running on port: ${port}`);
});

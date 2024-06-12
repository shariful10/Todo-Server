require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ObjectId } = require("mongodb");

const cors = require("cors");

// app.use((req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
// 	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
// 	next();
// });

const corsOptions = {
	origin: "https://todo-module-3.vercel.app",
	credentials: true,
	optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

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
			const result = await taskCollection.findOne({ _id: new ObjectId(id) });
			res.send(result);
		});

		app.delete("/task/:id", async (req, res) => {
			const id = req.params.id;
			const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
			res.send(result);
		});

		app.get("/task/:id", async (req, res) => {
			const id = req.params.id;
			const result = await taskCollection.findOne({ _id: new ObjectId(id) });
			res.send(result);
		});

		app.put("/task/:id", async (req, res) => {
			const id = req.params.id;
			const task = req.body;

			const updateDoc = {
				$set: {
					isCompleted: task.isCompleted,
					title: task.title,
					description: task.description,
					priority: task.priority,
				},
			};

			const result = await taskCollection.updateOne(
				{ _id: new ObjectId(id) },
				updateDoc,
				{ upsert: true }
			);
			res.send(result);
		});

		console.log("Successfully connected to MongoDB!");
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

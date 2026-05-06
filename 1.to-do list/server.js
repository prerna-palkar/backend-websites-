import express from 'express';

const app = express();

app.use(express.json());

let todos = [];

app.get("/todos",(req,res)=>{
    res.json(todos);
});

app.post("/todos",(req,res)=>{
    const {title} = req.body;

    const newTodo = {
        id : Date.now(),
        title : title ,
        completed : false

    };

    todos.push(newTodo);
    res.json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;

    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    todos = todos.filter(t => t.id !== id);

    res.json({ message: "Todo deleted" });
});

app.listen(3000);
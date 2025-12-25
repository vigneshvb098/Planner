import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8ed456c2/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all tasks
app.get("/make-server-8ed456c2/tasks", async (c) => {
  try {
    const tasks = await kv.getByPrefix("task:");
    return c.json({ success: true, tasks });
  } catch (error) {
    console.log(`Error fetching tasks: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new task
app.post("/make-server-8ed456c2/tasks", async (c) => {
  try {
    const task = await c.req.json();
    const taskId = `task:${Date.now()}`;
    await kv.set(taskId, task);
    return c.json({ success: true, id: taskId, task });
  } catch (error) {
    console.log(`Error creating task: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update a task
app.put("/make-server-8ed456c2/tasks/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(id);
    
    if (!existing) {
      return c.json({ success: false, error: "Task not found" }, 404);
    }
    
    const updated = { ...existing, ...updates };
    await kv.set(id, updated);
    return c.json({ success: true, task: updated });
  } catch (error) {
    console.log(`Error updating task ${c.req.param("id")}: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a task
app.delete("/make-server-8ed456c2/tasks/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting task ${c.req.param("id")}: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
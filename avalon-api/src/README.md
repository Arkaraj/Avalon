# Avalon's API

## Routes:

### General Routes

GET /room gets all rooms(where user is a member) of a user
GET /croom gets all rooms created by the user
POST /room creates a room for the user// content: name
DELETE /room/:roomId user leaves the room

### Join

POST /join joins the room based on the nanoid code// content: code

### Task Routes

GET /tasks/:room_id gets tasks of the pirticular room
PUT /tasks/:room_id updates the tasks// content: {completed: true}

### Admins

GET /:room_id gets all members in the room with there tasks of that room
POST /task/:room_id/:user_id admins posts tasks to members// content: Task
DELETE /task/:room_id/:user_id deletes/removes the task

#### To do
- [ ] Create all the routes
- [ ] Connect it with Svelte, polka fetch





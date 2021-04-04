# Avalon's API

## Routes:

### General Routes

- [x] GET /room gets all rooms(where user is a member) of a user
- [x] GET /croom gets all rooms created by the user
- [x] POST /room creates a room for the user// content: name, description
- [x] DELETE /room/:roomId user leaves the room

### Join

- [x] POST /join joins the room based on the nanoid code// content: code

### Task Routes

- [x] GET /task/ gets tasks of a pirticular user
- [x] GET /task/:room_id gets tasks of the pirticular room
- [x] PUT /task/:room_id updates the tasks// content: {completed: true}

### Admins

- [x] GET admin/:room_id gets all members in the room with there tasks of that room
- [x] POST admin/task/:room_id/:user_id admins posts tasks to members// content: Task
- [x] DELETE admin/task/:taskId deletes/removes the task

- [x] Get /admin/:roomId/:userId the specific students tasks(for admin) (**Important**)

- [x] DELETE /admin/:room_id/:user_id Admin should be able to kick members
- [x] DELETE /admin/:roomId Admin can dismantle the room

#### To do

- [x] Create all the routes
- [ ] Connect it with Svelte, polka fetch

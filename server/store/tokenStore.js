// Shared in-memory fallback store (used when MongoDB is offline)
const users = [];

const add          = (user)  => users.push(user);
const findByEmail  = (email) => users.find(u => u.email === email);
const findByToken  = (token) => users.find(u => u.token === token);
const findById     = (id)    => users.find(u => u.id === id);
const updateToken  = (email, token) => { const u = findByEmail(email); if (u) u.token = token; };

module.exports = { users, add, findByEmail, findByToken, findById, updateToken };

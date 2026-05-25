function signup(userData) {
  let users = loadData("users");

  users.push(userData);

  saveData("users", users);
}

function login(email, password) {
  let users = loadData("users");

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    saveData("currentUser", user);

    return true;
  }

  return false;
}

function logout() {
  localStorage.removeItem("currentUser");
}

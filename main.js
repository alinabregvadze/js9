get();

async function get() {
  let todos = await fetch("https://ucha.ge/todo/server.php").then(function(r) {
    return r.json();
  });

  console.log(todos);
  renderTodos(todos);
}

document.querySelector('#add-item-btn').addEventListener('click', add);

async function add() {
  let text = document.getElementById('new-item-text').value;

  let todos = await fetch("https://ucha.ge/todo/server.php", {
    method: 'POST',
    headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=add&text=' + encodeURIComponent(text)
  }).then(function(r) {
    return r.json();
  });

  clearListsContainer();
  renderTodos(todos);

  document.getElementById('new-item-text').value = '';
}

async function editItem(id, text) {
  let todos = await fetch("https://ucha.ge/todo/server.php", {
    method: 'POST',
    headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=update&id=' + id +'&text=' + encodeURIComponent(text) 
  }).then(function(r) {
    return r.json();
  });

  clearListsContainer();
  renderTodos(todos);
}

async function removeItem(id){
  let todos = await fetch("https://ucha.ge/todo/server.php", {
    method: 'POST',
    headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=remove&id=' + id
  }).then(function(r) {
    return r.json();
  });

  clearListsContainer();
  renderTodos(todos);
}

async function updateStatus(id, status){
  let todos = await fetch("https://ucha.ge/todo/server.php", {
    method: 'POST',
    headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=update&id=' + id + '&done=' + status
  }).then(function(r) {
    return r.json();
  });

  clearListsContainer();
  renderTodos(todos);
}

renderTodos = list => {
  for(let i = 0; i < list.length; i++) {
    let item = list[i];
    renderItem(item);
  };
};

renderItem = item => {
  let div = document.createElement('div');
  div.classList.add('todo-div');
  div.innerHTML = `
    <input type="checkbox" class="check">
    <input type="text" disabled class="editInput" value="${item.text}">
    <button class="btn edit"><i class="fas fa-pencil-alt blue"></i></button>
    <button class="btn save"><i class="fas fa-check blue"></i></button>
    <button class="btn delete"><i class="fas fa-trash red"></i></button>
  `;

  let checkbox = div.querySelector(".check");
  checkbox.checked = item.done;
  checkbox.addEventListener("change", function() {
    updateStatus(item.id, this.checked);
  });

  div.querySelector(".btn.edit").addEventListener("click", () => {
    div.querySelector(".editInput").disabled = false;
    div.classList.add('editing');
  });

  div.querySelector(".btn.save").addEventListener("click", () => {
      let text = div.querySelector(".editInput").value;
      editItem(item.id, text);
  });

  div.querySelector(".btn.delete").addEventListener("click", () => {
      removeItem(item.id);
      addToTrash(item);
  });

  document.querySelector('#list').appendChild(div);
}

clearListsContainer = () => document.querySelector("#list").innerHTML = '';

addToTrash = item => {
  let trashItem = document.createElement('div');
  trashItem.classList.add('todo-div');
  trashItem.classList.add('trashItem');
  trashItem.id = item.id
  trashItem.innerHTML = `
  <input type="text" disabled class="editInput" value="${item.text}">
  <button class="fas fa-undo undo"></button>`;
  
  document.getElementById("trashlist").appendChild(trashItem);
  
  trashItem.querySelector(".undo").addEventListener('click', () => addBack(trashItem));
}

async function addBack(item) {
  let text = item.querySelector('.editInput').value;
  let id = item.id;
  let todos = await fetch("https://ucha.ge/todo/server.php", {
    method: 'POST',
    headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=add&text=' + encodeURIComponent(text) + '&id=' + id
  }).then(function(r) {
    return r.json();
  });

  clearListsContainer();
  renderTodos(todos);

  item.remove();
}

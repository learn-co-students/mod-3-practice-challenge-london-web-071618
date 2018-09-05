function renderBookList(json) {
  json.forEach(book => {
    let newLi = document.createElement('li')
    newLi.innerHTML = `<a onclick="loadBook(this)">${book.title}</a>`
    document.getElementById('list-panel').appendChild(newLi)
  })
}

function addNewUserToList(json) {
  document.getElementById('users-list').innerHTML = ""
  json.users.forEach(user => {
    let entry = document.createElement('li')
    entry.innerHTML = `<b>${user.username}</b>`
    document.getElementById('users-list').appendChild(entry)
  })
}

function addNewUser(bookId, existingUsers, newUsername, newUserId) {
  let updatedUsers
  if (!!existingUsers === false) {
    updatedUsers = [{id: newUserId, username: newUsername}]
  } else {
    updatedUsers = [...existingUsers, {id: newUserId, username: newUsername}]
  }
  fetch(`http://localhost:3000/books/${bookId}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      users: updatedUsers
    })
  }).then(res => res.json()).
  then(json => addNewUserToList(json))}

function loadBookWindow(json, title) {
  let bookData = json.find(book => book.title === title)
  console.log(!!bookData.users)
  //open window and insert book information
  let newWindow = document.createElement('div')
  newWindow.innerHTML = `<h1>${bookData.title}</h1><img src=${bookData.img_url} /><p>${bookData.description}</p><ol id="users-list"></ol>`
  document.getElementById('show-panel').appendChild(newWindow)

  if (!!bookData.users === false) {
    document.getElementById('users-list').innerHTML = '<p>No users have read this yet</p>'
  } else {
    bookData.users.forEach(user => {
      let userEntry = document.createElement('li')
      userEntry.innerHTML = `<b>${user.username}</b>`
      document.getElementById('users-list').appendChild(userEntry)
    })
  }

  //create read button
  let readBtn = document.createElement('button')
  readBtn.innerText = "Read Book"
  document.getElementById('show-panel').appendChild(readBtn)
  readBtn.onclick = function() {
    fetch(`http://localhost:3000/books/${bookData.id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).
    then(json => {
      if (!!json.users === false) {
        addNewUser(bookData.id, bookData.users, "pouros", 1)
      } else {
        let listNames = json.users.map(user => user.username)
        if (listNames.includes("pouros")) {
          alert("You have already read this book.")
        } else {
          addNewUser(bookData.id, bookData.users, "pouros", 1)
        }
      }
    })




  }

}


function loadBook(element){
  document.getElementById('show-panel').innerHTML = ""
  let bookTitle = element.innerText
  console.log(bookTitle)
  fetch('http://localhost:3000/books', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json()).
  then(json => loadBookWindow(json, bookTitle))
}
function getBooks() {
  fetch('http://localhost:3000/books', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json()).
  then(json => renderBookList(json))
}


document.addEventListener("DOMContentLoaded", function() {
  getBooks()
});

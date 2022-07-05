const socket = io();

let divAllProducts = document.getElementById('divAllProducts');
let messagesCenter = document.getElementById('messagesCenter');
let loginDiv = document.getElementById('loginDiv');
let username = document.getElementById('username');

// funciona bien
function addProduct(e) {
    let newProduct = {
        title: document.getElementById('title').value,
        price: parseInt(document.getElementById('price').value),
        thumbnail: document.getElementById('thumbnail').value
    }
    socket.emit('getProducts', newProduct)
    return false
};

// funciona bien
function addMessage(e) {
    let date = new Date();
    let newMessage = {
        author: {
            email: document.getElementById('email').value,
            name: document.getElementById('name').value,
            lastname: document.getElementById('lastname').value,
            alias: document.getElementById('alias').value,
            age: document.getElementById('age').value,
            avatar: document.getElementById('avatar').value
        },
        text: document.getElementById('message').value,
        date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
    socket.emit('newMessage', newMessage)
    return false
};

function loginForm(user) {
    loginDiv.innerHTML = '';
    loginDiv.innerHTML += `<h1 class="w-100" id="messageToUser">Bienvenido ${user}</h1><form action="/logout" method="get" class="p-1" onSubmit="return logout(this)"><button type="submit" class="btn btn-danger flex-shrink-1 border">Logout</button></form>`;

}

function logout(e) {
    let messageToUser = document.getElementById('messageToUser');
    messageToUser.innerHTML = '';
    messageToUser.innerHTML += '<h1 class="w-100">Hasta luego </h1>'
    return true;
};

socket.on('products', data => {
    divAllProducts.innerHTML = '';
    data.forEach(product => {
        divAllProducts.innerHTML += `<tr>
                                        <th scope="row">${product.title}</th>
                                        <td>$ ${product.price}</td>
                                        <td>${product.thumbnail}</td>
                                    </tr>`
    });
});

socket.on('messages', data => {

    messagesCenter.innerHTML = ''
    data.forEach(message => {
        messagesCenter.innerHTML += `<p><span class="fw-bold blue">${message.author.email} </span><span class="brown">[${message.date}] </span>: <span class="fst-italic green">${message.text}</span>  <span"><image src=${message.author.avatar} class="avatar"></span></p>`
    })

});

socket.on('login', data => {
    let user;
    for (let i = 0; i < data.length; i++) {
        user = JSON.parse(data[i].session).user
        loginForm(user)
    }
});
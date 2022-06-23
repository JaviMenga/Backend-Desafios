const socket = io();

let divAllProducts = document.getElementById('divAllProducts');
let messagesCenter = document.getElementById('messagesCenter');
let productsTest = document.getElementById('products-test');

function addProduct(e) {
    let newProduct = {
        title: document.getElementById('title').value,
        price: parseInt(document.getElementById('price').value),
        thumbnail: document.getElementById('thumbnail').value
    }
    socket.emit('getProducts', newProduct)
    return false
};

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


socket.on('products', data => {
    divAllProducts.innerHTML = ''

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
})
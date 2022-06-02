const socket = io();

let divAllProducts = document.getElementById('divAllProducts');
let messagesCenter = document.getElementById('messagesCenter');

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
        email: document.getElementById('email').value,
        date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        message: document.getElementById('message').value
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
        messagesCenter.innerHTML += `<p><span class="fw-bold blue">${message.email} </span><span class="brown">[${message.date}] </span>: <span class="fst-italic green">${message.message}</span></p>`
    })
})
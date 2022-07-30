const socket = io();

let divAllProducts = document.getElementById('divAllProducts');

function addProduct(e) {
    let newProduct = {
        title: document.getElementById('title').value,
        price: parseInt(document.getElementById('price').value),
        thumbnail: document.getElementById('thumbnail').value
    }
    socket.emit('getProducts', newProduct)
    return false
};

function logout(e) {
    let messageToUser = document.getElementById('messageToUser');
    messageToUser.innerHTML = '';
    messageToUser.innerHTML += '<h1 class="w-100">Hasta luego </h1>'
    return true;
};

socket.on('products', data => {
    if (divAllProducts) {
        divAllProducts.innerHTML = '';
        data.forEach(product => {
            divAllProducts.innerHTML += `<tr>
                                        <th scope="row">${product.title}</th>
                                        <td>$ ${product.price}</td>
                                        <td>${product.thumbnail}</td>
                                    </tr>`
        });
    }
});
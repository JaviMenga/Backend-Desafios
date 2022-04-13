class Usuario {
    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName() {
        return this.nombre
    }
    addMascota(mascotaAgregada) {
        this.mascotas.push(mascotaAgregada)
        return this.mascotas
    }
    countMascotas() {
        return this.mascotas.length
    }
    addBooks(titulo, autor) {
        this.libros.push({ titulo: titulo, autor: autor })
        return this.libros
    }
    getBookNames() {
        const nombresLibros = this.libros.map((libros) => {
            return libros.titulo
        })
        return nombresLibros
    }
}

let Javier = new Usuario('Javier', 'Menga', [{ titulo: 'El señor de los anillos', autor: 'William Golding' }, { titulo: 'Fundación', autor: 'Isaac Asimov' }], ['Maui', 'Galdalf']);

console.log(Javier.getFullName())
console.log(Javier.addMascota('Merlin'))
console.log(Javier.countMascotas())
console.log(Javier.addBooks('El código Da Vinci', 'Dan Brown'))
console.log(Javier.getBookNames())
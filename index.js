// Requerimos el módulo express para crear nuestra aplicación web
var express = require("express");

// Requerimos el módulo express-graphql que nos permitirá utilizar GraphQL con Express
const { graphqlHTTP } = require("express-graphql");

// Requerimos el módulo buildSchema de GraphQL que nos permitirá construir nuestro schema
var { buildSchema } = require("graphql");

// Construimos el schema que define la estructura de nuestra API
var schema = buildSchema(`
  type Cliente {
    id: Int
    nombre: String
    telefono: String
  }

  type Query {
    clientes: [Cliente]
    cliente(id: Int): Cliente
  }

  type Mutation {
    addCliente(nombre: String, telefono: String): Cliente
  }
`);

// Creamos un array vacío para almacenar los clientes
var clientes = [];

// Creamos un contador para asignar el ID de cada cliente
var counter = 1;

// Definimos un objeto root que contiene las funciones que se encargarán de resolver las peticiones a nuestra API
var root = {
  // Función que devuelve todos los clientes
  clientes: () => {
    return clientes;
  },

  // Función que devuelve un cliente con un ID específico
  cliente: (data) => {
    for (var i = 0; i < clientes.length; i++)
      if (clientes[i].id == data.id) return clientes[i];

    return null;
  },

  // Función que añade un nuevo cliente al array y devuelve el cliente añadido
  addCliente: (data) => {
    var c = { id: counter, nombre: data.nombre, telefono: data.telefono };
    clientes.push(c);
    counter++;
    return c;
  },
};

// Creamos una aplicación web con express
var app = express();

// Configuramos nuestra aplicación web para que utilice GraphQL en la ruta /graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema, // Utilizamos el schema que hemos definido anteriormente
    rootValue: root, // Utilizamos el objeto root que hemos definido anteriormente
    graphiql: true, // Habilitamos la interfaz de GraphiQL para probar nuestra API
  })
);

// Arrancamos el servidor en el puerto 4000
app.listen(4000);

// Mostramos un mensaje por consola para indicar que la API está funcionando
console.log("GraphQL API en http://localhost:4000/graphql");

// Es un ejemplo básico de cómo construir una API con GraphQL utilizando Express y el módulo express-graphql.

// En resumen, este código define un schema que define la estructura de la API, que en este caso tiene un tipo Cliente, una query para obtener clientes (clientes y cliente) y una mutación para añadir nuevos clientes (addCliente).

// Después, se crea un objeto root que contiene las funciones que se encargan de resolver las peticiones a nuestra API. En este caso, tenemos tres funciones: clientes que devuelve todos los clientes, cliente que devuelve un cliente con un ID específico y addCliente que añade un nuevo cliente al array y devuelve el cliente añadido.

// Por último, se crea una aplicación web con Express que utiliza express-graphql para utilizar GraphQL en la ruta /graphql. Cuando se recibe una petición en esta ruta, express-graphql utiliza el schema y las funciones de root para resolver la petición y devolver una respuesta. Además, se habilita la interfaz de G
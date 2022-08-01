const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLInterfaceType,
    
} = require('graphql')
const app = express()

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name:  'HelloWorld',
        
//         fields:() => ({
//             message : {
//                 type: GraphQLString,
//                 resolve: () => 'Hello World'
//             }

//         })
//     })
// })

const AuthorType = new GraphQLObjectType({
    name:'Author',
    description:'Represents a Author',
    fields : () => ({
        id :{ type : new GraphQLNonNull(GraphQLInt)},
        name :{ type : new GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
              return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name:'Book',
    description:'Represents a book written by an author',
    fields : () => ({
        id :{ type : new GraphQLNonNull(GraphQLInt)},
        name :{ type : new GraphQLNonNull(GraphQLString)},
        authorId :{ type : new GraphQLNonNull(GraphQLInt)},
        author : {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)//populating
            }
        }
    })
})




const RootQuery = new GraphQLObjectType({
    name: 'Query',
    description : 'Root Query',
    fields : () => ({
        book: {
            type: BookType,
            description: 'A Single Book',
            args: {
              id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },//Book by ID


        author: {
            type: AuthorType,
            description: 'A Single Author',
            args: {
              id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },//author by ID
        
        books: {
            type: new GraphQLList(BookType),
            description: 'List of all the Books',
            resolve: () => books
        },//Get books equivalent

        authors: {
            type:  new GraphQLList(AuthorType),
            description: "Lis of all authors",
            resolve: ()=> authors
        }//Get all authors
    })
})


const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
      addBook: {
        type: BookType,
        description: 'Add a book',
        args: {
          name: { type: new  GraphQLNonNull(GraphQLString) },
          authorId: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve: (parent, args) => {
          const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
          books.push(book)
          return book
        }
      },//Create Book

      updateBook: {
        type: BookType,
        description: 'Update a book',
        args: {
        
            id : {type : new GraphQLNonNull(GraphQLInt)},
          name: { type: new GraphQLNonNull(GraphQLString) },
          authorId: { type:new GraphQLNonNull(GraphQLInt) }
        },
        resolve: (parent, args) => {
          books[args.id - 1].name= args.name
          books[args.id - 1].authorId= args.authorId
          return books[args.id - 1]
        }
      },
      

      removeBook: {
        type : BookType,
        description : 'Remove a Book',
        args : {
            id : {type: new GraphQLNonNull(GraphQLInt)}
        },
        resolve: (parent, args) => {
            books = books.filter(book => book.id !== args.id)
            return books[args.id]
        }
      },//Delete Book

      addAuthor: {
        type: AuthorType,
        description: 'Add an author',
        args: {
          name: { type:  new GraphQLNonNull(GraphQLString) }
        },
        resolve: (parent, args) => {
          const author = { id: authors.length + 1, name: args.name }
          authors.push(author)
          return author
        }
      },

      removeAuthor: {
        type : AuthorType,
        description : 'Remove a Author',
        args : {
            id : {type: new GraphQLNonNull(GraphQLInt)}
        },
        resolve: (parent, args) => {
            authors = authors.filter(author => author.id !== args.id)
            return authors[args.id]
        }
      }
    })
})



const schema = new GraphQLSchema({
    query : RootQuery,
    mutation: RootMutationType
})

var authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

var books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

app.use('/graphql', expressGraphQL({
    schema: schema,
    
    graphiql: true
}))
app.listen(5000, ()=> console.log('Server Running'))

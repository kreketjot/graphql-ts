import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { v4 } from 'uuid'
import { AddUserPostInput, CreateUserInput, GetPostQuery, GetUserQuery, ID, Post, User, schema } from './schema'

dotenv.config()

const users: User[] = [
  {
    id: '1',
    username: 'Andrey',
    role: 'ADMIN',
    posts: [
      {
        id: '1',
        title: '1st post',
        content: 'Lorem ipsum',
      },
    ],
  },
]

const app = express()
app.use(cors())

const getUser = (id: ID) => users.find(user => user.id === id)

const root = {
  getAllUsers: () => users,
  getUser: (query: GetUserQuery) => getUser(query.id),
  getPost: (query: GetPostQuery) => users.flatMap(user => user.posts).find(post => post.id === query.id),
  createUser: (input: CreateUserInput) => {
    const user: User = {
      id: v4(),
      ...input.input,
      posts: [],
    }
    users.push(user)
    return user
  },
  addUserPost: (input: AddUserPostInput) => {
    const post: Post = {
      id: v4(),
      title: input.input.postTitle,
      content: input.input.postContent,
    }
    const user = getUser(input.input.userId)
    if (user === undefined) {
      throw "User doesn't exist"
    }
    user.posts.push(post)
    return user
  },
}

app.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
    schema,
    rootValue: root,
  }),
)

app.get('/ping', (req, res) => {
  res.send('pong')
})

const port = process.env.PORT
if (port === undefined) {
  throw 'PORT is undefined'
}

app.listen(port, () => console.log(`server started at port: ${port}`))

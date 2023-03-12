import { buildSchema } from 'graphql'

export const schema = buildSchema(`
  enum Role {
    ADMIN
    EDITOR
    GUEST
  }

  type User {
    id: ID
    username: String
    role: Role
    posts: [Post]
  }

  type Post {
    id: ID
    title: String
    content: String
  }

  input CreateUserInput {
    username: String!
    role: Role!
  }

  input AddUserPostInput {
    userId: ID!
    postTitle: String!
    postContent: String!
  }

  type Query {
    getAllUsers: [User]
    getUser(id: ID): User
    getPost(id: ID): Post
  }

  type Mutation {
    createUser(input: CreateUserInput): User
    addUserPost(input: AddUserPostInput): User
  }
`)

export type ID = string

export type Role = 'ADMIN' | 'EDITOR' | 'GUEST'

export type User = {
  id: ID
  username: string
  role: Role
  posts: Post[]
}

export type Post = {
  id: ID
  title: string
  content: string
}

export type GetUserQuery = Pick<User, 'id'>

export type GetPostQuery = Pick<Post, 'id'>

export type CreateUserInput = {
  input: Omit<User, 'id' | 'posts'>
}

type PostPrefix<T> = {
  [K in keyof T as `post${Capitalize<string & K>}`]: T[K]
}

export type AddUserPostInput = {
  input: {
    userId: User['id']
  } & PostPrefix<Omit<Post, 'id'>>
}

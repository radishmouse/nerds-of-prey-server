# overview

so far, the best one:

[https://medium.com/react-native-training/react-native-with-apollo-server-and-client-part-1-efb7d15d2361](https://medium.com/react-native-training/react-native-with-apollo-server-and-client-part-1-efb7d15d2361)

# the client

[https://medium.com/react-native-training/react-native-with-apollo-part-2-apollo-client-8b4ad4915cf5](https://medium.com/react-native-training/react-native-with-apollo-part-2-apollo-client-8b4ad4915cf5)


## definitions and shit

- your models are your ORM + the fields you define
  - (it uses your ORM's schema)
- the GraphQL schema is separate from the ORM schema.
  - it uses the GraphQL language for defining 
- resolvers are functions invoked by the GraphQL engine to query the database engine

## questions:

- what's the RootQuery?
- why is the schema type necessary?
  - i understand the type, but...
  - it seems only to refer to the root query...
- what's a schema?
  - a schema is an array of strings. the strings contain type definitions




## 2017-05-04 22:58

This is what giving up looks like.
We're gonna follow a tutorial and then adapt the code.

It stings. It really stings.

## ok, following a tutorial

and that tutorial is [this one](https://medium.com/react-native-training/react-native-with-apollo-server-and-client-part-1-efb7d15d2361)

so, i've gone as far as the `schema.js` and i'm wondering:

- does the GraphQL schema always just follow the db schema?

## 2017-05-04 23:08

ok, so, the `connector.js' seems to be oriented singularly
towards our mongoose schema.

according to the tutorial, it links the GraphQL server to our MongoDB.

## 2017-05-04 23:40

your schema declares a RootQuery
that RootQuery is defined as a resolver
The resolver uses the connector to do the actual work.


You tie these together using the `makeExecutableSchema` function
provided by the `graphql-tools` package.

The result of calling this gives you an object you can pass to the Apollo server.


### to recap:

you create executable schemas via GraphQL schema definitions
coupled with resolver functions.
(schemas declare a RootQuery, resolvers define them.)

then, the apollo server can use that executable schema with the
stuff you defined as the glue code (connector.js)





---


# define the schema

in `schema.js`, add your typeDefinitions


---

# 2017-05-05

## 10:42

you know what's a joy?
being able to debug in vs code.

i had to give up the async/await functions, but
being able to know what's going on is much more important.


## 11:01

Figured out why my resolvers for collections (`activities`) weren't
providing an iterable result: I was using `find` and not `findAll`

Lesson: you should actually read the sequelize docs ;)


### querying for all tags

(only including the ids of activities)

```
{
	tags{
    id
		name
    activities{
      id
    }
  }
}
```

## 11:10 - writing the first mutation

Pattern:
- in schema.js
  - define the type
  - include in the schema declaration
- in resolvers.js
  - define a resolver function
  - add to the Mutation object

Here's the query.

```
mutation {
  addActivity(tsStart:"100", tsEnd:"200") {
    id
  }
}
```


## 11:59 - trying to figure out how to pass an array to mutation

I think? this worked:

```

mutation {
  addTag(name:"bobbing for apples", activities: [1, 2, 3]) {
    id
  }
}
```

and
```
mutation {
  addActivity(tsStart:"100", tsEnd:"200", tags: [1, 2, 3]) {
    id
  }
}
```

## 12:11 - filtering by timestamp range

ok... how do i do this?

and...lunch.

## 13:09 - post lunch, back to work

## 13:24

wow. that was amazing.
sequelize generates methods like `addTag` and `removeTag`


## 13:42

and now, to figure out filtering by min/max time.

i just had to add optional arguments to the `activities` Query.
Then, I modified my resolver so that it checks for those
arguments. If they exist, add a `where` clause for my
actual `tsStart` and `tsEnd`

## 13:50 - what's my next feature?

it's activities by tag.
and that's tricky, because i can't seem to figure out how
to do a `findAll` and filter by the tabs for that activity.

So, I could try this:

- if there is a tagId supplied, first get that tag.
- then, return its association of activities.

That works, except I can't also filter by timestamp.
That's kind of important.

I feel like there's a way to write that as a where clause

### 14:09 - found it.

it's [here](http://docs.sequelizejs.com/en/v3/docs/querying/#relations-associations)


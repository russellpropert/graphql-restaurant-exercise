const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const express = require("express");

// Construct a schema, using GraphQL schema language
const restaurants = [
  {
    id: '1',
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccoli",
        price: 11,
      },
    ],
  },
  {
    id: '2',
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: '3',
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];

const schema = buildSchema(`#graphql
type Query {
  restaurant(id: ID!): Restaurant
  restaurants: [Restaurant]
},
type Restaurant {
  id: ID!
  name: String!
  description: String
  dishes:[Dish!]!
}
type Dish {
  name: String!
  price: Int!
}
input restaurantInput {
  id: ID!
  name: String!
  description: String
  dishes: [dishInput!]!
}
input dishInput {
  name: String!
  price: Int!
}
input RestaurantUpdateInput {
  name: String
  description: String
}
type DeleteResponse {
  ok: Boolean!
}
type Mutation {
  setRestaurant(input: restaurantInput!): Restaurant
  deleteRestaurant(id: ID!): DeleteResponse
  editRestaurant(id: ID!, input: RestaurantUpdateInput!): Restaurant
}
`);
// The root provides a resolver function for each API endpoint

const root = {
  restaurant: (arg) => {
    return restaurants.find(restaurant => restaurant.id === arg.id)
  },
  restaurants: () => {
    return restaurants
  },
  setRestaurant: ({ input }) => {
    if (!restaurants.some(restaurant => restaurant.id === input.id)) {
      restaurants.push(input);
      return input;
    } else {
      throw new Error(`The id of ${input.id} is already in use.`);
    }
  },
  deleteRestaurant: ({ id }) => {
    const restaurant = restaurants.find(restaurant => restaurant.id === id);
    const ok = Boolean(restaurant);
    const index = restaurants.indexOf(restaurant);
    restaurants.splice(index, 1);
    return {ok};  },
  editRestaurant: ({ id, input }) => {
    const restaurant = restaurants.find(restaurant => restaurant.id === id);
    if (restaurant) {
      Object.assign(restaurant, input)
    } else {
      throw new Error("Restaurant doesn't exist");
    }
    return restaurant;
  },
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const port = 5500;
app.listen(port, () => console.log("Running Graphql on Port:" + port));

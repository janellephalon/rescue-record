import { Client } from "@petfinder/petfinder-js";

const client = new Client({
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
});

export default client;

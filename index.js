import express from "express";
import cors from "cors";

import recipes from "./data/recipes.json" assert {type: "json"};

const app = express()
const port = 3001

app.use(cors())


app.get('/recipes', (req, res) => {
  res.json(recipes.map(recipe => ({
    _id: recipe._id,
    title: recipe.title,
    preparationTime: recipe.preparationTime,
    slug: recipe.slug,
    lastModifiedDate: recipe.lastModifiedDate
  })));
})

app.get('/recipes/:slug', (req, res) => {
  const recipe = recipes.find(recipe => recipe.slug === req.params.slug)

  res.json(recipe)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

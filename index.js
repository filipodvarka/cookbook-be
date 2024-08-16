import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import recipesData from "./data/recipes.json" with {type: "json"};
import { v4 as uuidv4 } from 'uuid';
import assert from "node:assert";

const app = express()
const port = 3001

app.use(cors())
app.use(bodyParser.json())

const recipes = Array.from(recipesData)

app.get('/recipes', (req, res) => {
  res.json(recipes.map(recipe => ({
    _id: recipe._id,
    title: recipe.title,
    preparationTime: recipe.preparationTime,
    slug: recipe.slug,
    lastModifiedDate: recipe.lastModifiedDate
  })));
})

const slugsExists = (slug) => recipes.some(recipe => recipe.slug === slug)

app.get('/recipes/:slug', (req, res) => {
  if (!slugsExists(req.params.slug)) {
    res.status(404).json({ error: 'Recipe not found' })
    return
  }

  const recipe = recipes.find(recipe => recipe.slug === req.params.slug)

  res.json(recipe)
})

const ALLOWED_KEYS = ['title', 'preparationTime', 'ingredients', 'directions']
const REQUIRED_KEYS = ['title']

const validateRecipe = (recipe) => {
  assert(recipe, 'Recipe is required')
  assert(Object.keys(recipe).every((key) => ALLOWED_KEYS.includes(key)), 'Forbidden key in recipe')
  assert(REQUIRED_KEYS.every((key) => Object.keys(recipe).includes(key)), 'Missing required key in recipe')
};

app.post(['/recipes', '/recipes/:slug'], (req, res) => {
  const recipe = req.body
  if (req.path.includes(':slug') && !slugsExists(req.params.slug)) {
    res.status(404).json({ error: 'Recipe not found' })
    return
  }

  validateRecipe(recipe)

  const newRecipe = {
    ...recipe,
    _id: uuidv4(),
    slug: recipe.title.toLowerCase().replace(/ /g, '-'),
    lastModifiedDate: new Date().toISOString()
  }
  recipes.push(newRecipe)
  recipes.sort((a, b) => new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate))

  res.json(newRecipe)
})


app.delete('/recipes/:slug', (req, res) => {
  if (!slugsExists(req.params.slug)) {
    res.status(404).json({ error: 'Recipe not found' })
    return
  }

  const recipeIndex = recipes.findIndex(recipe => recipe.slug === req.params.slug)
  recipes.splice(recipeIndex, 1)

  res.status(204).json()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

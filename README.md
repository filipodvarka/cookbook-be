# Cookbook backend

## Description

This is a simple backend for cookbook frontend. It only has two endpoints.

## Endpoints

### GET /recipes

Returns a list of recipes.

### GET /recipes/:slug

Returns a single recipe by slug. Includes few more fields.

### POST /recipes

Create a new recipe.

### POST /recipes/:slug

Update a recipe by slug.

### DELETE /recipes/:slug

Delete a recipe by slug.

## How to run

1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. The server will be running on `http://localhost:3001`

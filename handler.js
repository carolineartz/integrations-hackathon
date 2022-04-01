"use strict";

const https = require('https')

module.exports.cocktail = async (event) => {
  try {
    let dataString = '';

    const response = await new Promise((resolve, reject) => {
      const req = https.get('https://www.thecocktaildb.com/api/json/v1/1/random.php', (resp) => {
        resp.on('data', (chunk) => {
          dataString += chunk;
        })

        resp.on('end', () => {
          const data = JSON.parse(dataString);
          const drinkData = data.drinks[0]

          const drink = {
            id: drinkData.idDrink,
            recipe: extractRecipe(drinkData),
            preparation: drinkData.strInstructions,
            img_thumbnail: drinkData.strDrinkThumb
          }

          resolve({
            statusCode: 200,
            body: JSON.stringify(drink, null, 2)
          });
        });
      })

      req.on('error', (error) => {
        console.log(error)
        reject({
          statusCode: 500,
          body: `Unexpected error ${error.message}. Please check logs.`
        });
      });
    })

    return response
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: `Unexpected error ${error.message}. Please check logs.`
    }
  }
};

module.exports.disasterGif = async (event) => {
  try {
    let dataString = '';

    const response = await new Promise((resolve, reject) => {
      const req = https.get(generateGiphyUrl('worried'), (resp) => {
        resp.on('data', (chunk) => {
          dataString += chunk;
        })

        resp.on('end', () => {
          const data = JSON.parse(dataString);
          const url = getGifSrc(data)

          resolve({
            statusCode: 200,
            body: JSON.stringify({ url }, null, 2)
          });
        });
      })

      req.on('error', (error) => {
        console.log(error)
        reject({
          statusCode: 500,
          body: `Unexpected error ${error.message}. Please check logs.`
        });
      });
    })

    return response
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: `Unexpected error ${error.message}. Please check logs.`
    }
  }
}

module.exports.doneGif = async (event) => {
  try {
    let dataString = '';

    const response = await new Promise((resolve, reject) => {
      const req = https.get(generateGiphyUrl('finished'), (resp) => {
        resp.on('data', (chunk) => {
          dataString += chunk;
        })

        resp.on('end', () => {
          const data = JSON.parse(dataString);
          const url = getGifSrc(data)

          resolve({
            statusCode: 200,
            body: JSON.stringify({ url }, null, 2)
          });
        });
      })

      req.on('error', (error) => {
        console.log(error)
        reject({
          statusCode: 500,
          body: `Unexpected error ${error.message}. Please check logs.`
        });
      });
    })

    return response
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: `Unexpected error ${error.message}. Please check logs.`
    }
  }
}


function extractRecipe(drink) {
  const recipe = [`*${drink.strDrink}*\n`]

  const ingredients = []
  const measurements = []

  Object.entries(drink).forEach(([k, v]) => {
    if (k.startsWith("strIngredient") && v !== null) {
      ingredients.push(v)
    } else if (k.startsWith("strMeasure") && v !== null) {
      measurements.push(v)
    }
  })

  measurements.forEach((measurement, i) => {
    recipe.push(`${measurement} *${ingredients[i]}*`)
  })

  return recipe.join("\n")
}


const TOTAL_COUNT = 500

function generateGiphyUrl(search) {
  const offset = Math.floor(Math.random() * (TOTAL_COUNT - 1)) + 1

  return `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${search}&limit=1&offset=${offset}`
}

function getGifSrc(payload) {
  const item = payload.data[0]

  return item.images.original.url
}

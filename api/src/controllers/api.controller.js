const axios = require("axios");
const { Parser } = require("json2csv");
const fs = require('fs');


module.exports = {
  getItems: async (req, res) => {
    let products = ["notebook apple", "notebook asus", "notebook hp"];

    let response = [];
    for (const product of products) {
      let firts_product_IDs = [];
      let offset = 0;
      while (offset < 150) {
        const firt_URL = `https://api.mercadolibre.com/sites/MLA/search?q=${product}&offset=${offset}`;
        const { data } = await axios.get(firt_URL);
        firts_product_IDs = firts_product_IDs.concat(
          data.results.map((elem) => elem.id)
        );
        offset = offset + 50;
      }
      let results_first_product = [];
      for (const productID of firts_product_IDs) {
        console.log(`getting ${productID} info`);
        const { data } = await axios.get(
          `https://api.mercadolibre.com/items/${productID}`
        );
        results_first_product = results_first_product.concat(data);
      }
      let partialResponse = results_first_product.map((item) => {
        return {
          query: product,  
          id: item.id,
          title: item.title,
          price: item.price,
          available_quantity: item.available_quantity,
          condition: item.condition,
          permalink: item.permalink,
          warranty: item.warranty,
        //   seller_address: `${item.seller_address.city.name}, ${item.seller_address.state.name}`
        };
      });
      response = response.concat(partialResponse);
    }

    const fields = [
      {
        label: "Query de Busqueda",
        value: "query",
      },
      {
        label: "ID",
        value: "id",
      },
      {
        label: "Titulo del producto",
        value: "title",
      },
      {
        label: "Precio",
        value: "price",
      },
      {
        label: "Cantidad disponible",
        value: "available_quantity",
      },
      {
        label: "Condicion",
        value: "condition",
      },
      {
        label: "Link al item",
        value: "permalink",
      },
      {
        label: "Garantia",
        value: "warranty",
      },
    //   {
    //     label: "Direccion vendedor",
    //     value: "seller_address",
    //   },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(response);
    try {
      fs.writeFile("reporte-notebooks.csv", csv, "utf8", (err) => {
        if (err) {
          console.log(
            "Some error occured - file either not saved or corrupted file saved."
          );
          return res.status(404).send("fail creating csv");
        } else {
          console.log("It's saved!");
        }
      });
      // res.attachment('Comparacion de productos.csv').send(csv)
    } catch (err) {
      console.error(err);
      return res.status(404).send("fail creating csv");
    }
    res.status(200).send(csv);
  },
};

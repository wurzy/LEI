var express = require('express');
var router = express.Router();
const fs = require("fs")
const fsEx = require('fs-extra')


const model = `{
  "kind": "collectionType",
  "collectionName": "produtos",
  "info": {
    "name": "Produto",
    "description": ""
  },
  "options": {
    "increments": true,
    "timestamps": true,
    "draftAndPublish": true
  },
  "attributes": {
    "titulo": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "preco": {
      "type": "decimal"
    },
    "quantidade": {
      "type": "integer"
    },
    "descricao": {
      "type": "text"
    },
    "categorias": {
      "collection": "categoria",
      "via": "produtos"
    },
    "prod": {
      "type": "component",
      "repeatable": false,
      "component": "produtor.produtor"
    }
  }
}
`

const strContro = `'use strict';
  
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {};`  

const strModels = `'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {};`

const strServices = `'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {};
`
  



//router.get('/dir/:nome', function(req, res, next) {
//  fs.mkdir("../api/api/"+req.params.nome, (err) => { 
//    if (err) { 
//        return console.error(err); 
//    } 
//    return console.log('Directory created successfully!'); 
//  }); 
//  return  console.error(""); 
//
//});


router.post('/genAPI', function(req, res, next) {
  var apiname = req.body["api"]
  fs.mkdir("../api/api/"+apiname, (err) => { 
    if (err) { 
        return console.error(err); 
    }
    fs.mkdir("../api/api/"+apiname+"/config", (err) => { 
      if (err) { 
          return console.error(err); 
      }
      // Data which will write in a file. 
      let data = `{
  "routes": [
    {
      "method": "GET",
      "path": "/${apiname}",
      "handler": "${apiname}.find",
      "config": {
        "policies": []
      }
    },
    {
      "method": "GET",
      "path": "/${apiname}s/count",
      "handler": "${apiname}.count",
      "config": {
        "policies": []
      }
    },
    {
      "method": "GET",
      "path": "/${apiname}s/:id",
      "handler": "${apiname}.findOne",
      "config": {
        "policies": []
      }
    },
    {
      "method": "POST",
      "path": "/${apiname}s",
      "handler": "${apiname}.create",
      "config": {
        "policies": []
      }
    },
    {
      "method": "PUT",
      "path": "/${apiname}s/:id",
      "handler": "${apiname}.update",
      "config": {
        "policies": []
      }
    },
    {
      "method": "DELETE",
      "path": "/${apiname}s/:id",
      "handler": "${apiname}.delete",
      "config": {
        "policies": []
      }
    }
  ]
}`

      fs.writeFile("../api/api/"+apiname+"/config/routes.json", data, (err) => { 
          if (err) throw err; 
      }) 
      return console.log('Config created successfully!'); 
    });  

    fs.mkdir("../api/api/"+apiname+"/controllers", (err) => { 
      if (err) { 
          return console.error(err); 
      } 
      fs.writeFile("../api/api/"+apiname+"/controllers/"+apiname+".js", strContro, (err) => { 
        if (err) throw err; 
      })  
      return console.log('controllers created successfully!'); 
    }); 

    fs.mkdir("../api/api/"+apiname+"/models", (err) => { 
      if (err) { 
          return console.error(err); 
      } 
      fs.writeFile("../api/api/"+apiname+"/models/"+apiname+".js", strModels, (err) => { 
        if (err) throw err; 
      })  
      fs.writeFile("../api/api/"+apiname+"/models/"+apiname+".settings.json", model, (err) => { 
        if (err) throw err; 
      })
      return console.log('models created successfully!'); 
    }); 

    fs.mkdir("../api/api/"+apiname+"/services", (err) => { 
      if (err) { 
          return console.error(err); 
      } 
      fs.writeFile("../api/api/"+apiname+"/services/"+apiname+".js", strServices, (err) => { 
        if (err) throw err; 
      }) 
       
      return console.log('services created successfully!'); 
    }); 

    return console.log('Directory created successfully!'); 
  }); 

  //console.log("req.body :"+ apiname)
  // Sync:
  //try {
  //  fsEx.copySync('../Strapi', '../'+apiname)
  //  console.log('folder criado com success!')
  //} catch (err) {
  //  console.error(err)
  //}

  //fs.mkdir("../api/api/"+apiname, (err) => { 
  //  if (err) { 
  //    console.error(err); 
  //    return res.status(500).jsonp({error: err})
  //  } 
  //  console.log('Directory created successfully!'); 
  //  return res.status(201).jsonp({msg: "Directory created successfully!"})
  //}); 
})   

module.exports = router;

var express = require('express');
var router = express.Router();
const fs = require("fs")
const fsEx = require('fs-extra')


const model123 = `{
  "kind": "collectionType",
  "collectionName": "Dataset",
  "info": {
    "name": "Dataset",
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
  var mkeys = Object.keys(req.body["model"])
  var apiname = mkeys[0]
  var model = JSON.stringify(req.body["model"][`${apiname}`], null, 2)



  
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
      "path": "/${apiname}s",
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

  var ckeys = Object.keys(req.body["componentes"])
  var componentes = JSON.stringify(req.body["componentes"][`${ckeys[0]}`], null, 2)
  var compKeys = Object.keys(req.body["componentes"][`${ckeys[0]}`])
  fs.mkdir("../api/components/"+apiname, (err) => { 
    if (err) { 
        return console.error(err); 
    }       
    console.log("key:"+compKeys[0])

    compKeys.forEach(k => {
      //console.log("key:"+k)
      var str =  JSON.stringify(req.body["componentes"][`${ckeys[0]}`][`${k}`], null, 2)
      //console.log("str:"+str)

      fs.writeFile("../api/components/"+apiname+"/"+k+".json", str, (err) => { 
        if (err) throw err; 
      }) 
    });
    return console.log('components created successfully!'); 
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

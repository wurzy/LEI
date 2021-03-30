var express = require('express');
var router = express.Router();
const fs = require("fs")
const fsEx = require('fs-extra')
const AdmZip = require('adm-zip')
const archiver = require('archiver');

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

router.get('/download/:id', function(req, res, next) {
 
  console.log(req.params.id)
  try {
    //const output = fs.createWriteStream("./api-"+req.params.id+".zip");
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });
    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    archive.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      
    });
    
    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    archive.on('end', function() {
      console.log('Data has been drained');
      res.end()
    });

    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        console.log('ENOENT')
      } else {
        throw err;
      }
    });
    archive.on('error', function(err) {
      throw err;
    });

    archive.pipe(res);

    if (fs.existsSync('../api/api/'+req.params.id) && fs.existsSync('../api/components/'+req.params.id)) {
      archive.append(fs.createReadStream("../Strapi.zip"), { name: 'Strapi.zip' });
      archive.directory('../api/api/'+req.params.id,'api/'+req.params.id);
      archive.directory('../api/components/'+req.params.id,'components/'+req.params.id);

      archive.finalize();

      res.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${req.params.id}.zip`,
      })
    } else {
      res.writeHead(500, {
        "Content-Type": 'text/html'
      })
      res.end()
    }
    
  } catch (error) {
    res.writeHead(500, {
      "Content-Type": 'text/html'
    })
    res.end()
    return  console.error("Erro a zipar "+error); 
  }
});

/*//var zip = new AdmZip()
  //zip.addLocalFolder("./teste")
  //zip.writeZip("./testezipado.zip");
  console.log(req.params.id)
  try {
    var zip1 = new AdmZip("../Strapi.zip")
    console.log("1"); 
    zip1.addLocalFolder("../api/api/"+req.params.id,"/api/"+req.params.id)
    console.log("2"); 
    zip1.addLocalFolder("../api/components/"+req.params.id,"/components/"+req.params.id)
    console.log("3"); 
    zip1.writeZip("./api-"+req.params.id+".zip");
    //var buffer = zip1.toBuffer()
    console.log("4"); 

    //fs.writeFileSync("./api-"+req.params.id+".zip", buffer);
    console.log("5"); 

    return  console.log("zipado"); 

    //res.writeHead(200, {
    //  "Content-Type": "application/zip",
    //  "Content-Disposition": `attachment; filename=${filename}.zip`,
    //})*/

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
      var str =  JSON.stringify(req.body["componentes"][`${ckeys[0]}`][`${k}`], null, 2)

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

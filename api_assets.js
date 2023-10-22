//
// app.get('/assets', async (req, res) => {...});
//
// Return all the assets from the database:
//
const dbConnection = require('./database.js')

exports.get_assets = async (req, res) => {

  console.log("call to /assets...");

  try {



    //
    // TODO: remember we did an example similar to this in class with
    // movielens database (lecture 05 on Thursday 04-13)
    //
    // MySQL in JS:
    //   https://expressjs.com/en/guide/database-integration.html#mysql
    //   https://github.com/mysqljs/mysql
    //

    dbConnection.query('SELECT * FROM `assets` ORDER BY `userid` ASC;', function (error, results, fields) {
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
      if (error) throw error;

      const assetid = results[0]["assetid"];
      const assetname = results[0]["assetname"];
      const bucketkey = results[0]["bucketkey"];
      //console.log(results);
      res.json({message: "success", data: results});
      //assetid: assetid, assetname: assetname, bucketkey: bucketkey
    });
    

  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "data": []
    });
  }//catch

}//get

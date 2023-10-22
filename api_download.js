//
// app.get('/download/:assetid', async (req, res) => {...});
//
// downloads an asset from S3 bucket and sends it back to the
// client as a base64-encoded string.
//
const dbConnection = require('./database.js')
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

exports.get_download = async (req, res) => {

  console.log("call to /download...");

  try {

    
    //throw new Error("TODO: /download/:assetid");

    //
    // TODO
    //
    // MySQL in JS:
    //   https://expressjs.com/en/guide/database-integration.html#mysql
    //   https://github.com/mysqljs/mysql
    // AWS:
    //   https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
    //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
    //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/
    //

    let awsKey;
    const assetid = req.params.assetid;


    dbConnection.query(`SELECT * from assets where assetid = '${assetid}'`, async function (error, results, fields) {

      if (error) throw error;
      console.log(results[0]["bucketkey"]);

      const userid = results[0]["userid"]
      const assetname = results[0]["assetname"]
      const bucketkey = results[0["bucketkey"]]

      const params = {
        Bucket: s3_bucket_name, 
        Key: results[0]["bucketkey"]
      };

      const getObjectCommand = new GetObjectCommand(params);

      const response = await s3.send(getObjectCommand);
      let dataString = await response.Body.transformToString("base64");
      res.json({message: "success", userid: userid, assetname: assetname, bucketkey: bucketkey, data: dataString});
      return;

    });

    // (async () => {
    //   try {
    //     const response = await s3.send(getObjectCommand);
    //     const objectData = response.Body;
  
    //     const localFilePath = "local-file-path"; 
    //     const fileStream = fs.createWriteStream(localFilePath);
    //     objectData.pipe(fileStream);

    //     fileStream.on("close", () => {
    //       console.log(`Object downloaded and saved to ${localFilePath}`);
    //     });
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // })();

  }//try
  catch (err) {
    //
    // generally we end up here if we made a 
    // programming error, like undefined variable
    // or function:
    //
    res.status(400).json({
      "message": err.message,
      "user_id": -1,
      "asset_name": "?",
      "bucket_key": "?",
      "data": []
    });
  }//catch

}//get
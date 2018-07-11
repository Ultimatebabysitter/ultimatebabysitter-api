const aws = require('aws-sdk')
const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  signatureVersion: process.env.S3_SIGNATURE_VERSION,
  region: process.env.S3_REGION
})
const uuid = require('uuid/v1')

exports.get_signed_url = (req, res, next) => {
  const id = req.userData.userId
  const key = `${id}/${uuid()}.jpeg`
  s3.getSignedUrl(
    'putObject',
    {
      Bucket: process.env.S3_BUCKET_NAME,
      ContentType: 'jpeg',
      Key: key
    },
    (url) => res.send({
      key: key,
      url: url
    }).catch(err => { res.send({error: err}) })
  )
}

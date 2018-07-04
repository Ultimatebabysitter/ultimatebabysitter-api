const aws = require('aws-sdk')
const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
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
    (err, url) => res.send({
      key: key,
      url: url
    })
  )
}

export function validateAllowedFileTypes(req:Express.Request,file:Express.Multer.File,cb:Function){
  if (
    !file.originalname
      .toLowerCase()
      .match(/\.(mp3|mp4|jpg|jpeg|png|gif|webp|svg|webm)$/)
  ) {
    Object.assign(req,{fileValidationError:'Only audio,video, image,and url files are allowed!'})
    return cb(null, false);
  }
  cb(null, true);
}
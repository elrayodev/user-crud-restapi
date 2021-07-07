const dbValidators  = require('./db-validators');
const generarJWT    = require('./generar-JWT');
const googleVerify  = require('./google-verify');
const uploadFiles   = require('./upload-files');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...uploadFiles
}
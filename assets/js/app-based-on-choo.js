const GOOGLE_API_CREDENTIAL = require('./settings/google-api-credential.json');

import GoogleCoreAPI from './api/google/GoogleCoreAPI';

const google = new GoogleCoreAPI(GOOGLE_API_CREDENTIAL);

google.init(true).then(function(){console.log(google)});
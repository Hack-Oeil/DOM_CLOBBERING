const path = require('path');
const auth = require('./auth.middleware.js');
const hoFW = require("./ho-fw.js");

module.exports = (app) => {
    app.use(hoFW.absoluteUrl);

    // Route pour la page d'accueil
    app.get('/', require("./controller.home.js").get);

    // Route GET pour la page d'inscription
    app.get('/signup', auth.needNoAuth, require("./controller.signup.js").get);
    // Route POST pour gérer les données du formulaire d'inscription
    app.post('/signup', auth.needNoAuth, require("./controller.signup.js").post);

    // Route GET pour la page de connexion
    app.get('/signin', auth.needNoAuth, require("./controller.signin.js").get);
    // Route POST pour gérer les données du formulaire de connexion
    app.post('/signin', auth.needNoAuth, require("./controller.signin.js").post);

    // Disconnect
    app.get('/disconnect', auth.needAuth, require("./controller.signin.js").disconnect);

    // Route pour la page de profil
    app.get('/profile', auth.needAuth, require("./controller.profile.js").get);
    app.get('/profile/:username', auth.needAuthAdmin, require("./controller.profile.js").get);

    app.post('/update-github', auth.needAuth, require("./controller.profile.js").update);

    app.get('/bot-connected/' + process.env.SECRET_SESSION, require("./controller.profile.js").botConnect);

    app.get('/api/user/:username', require("./controller.api.user.js").get);
    app.put('/api/valid-account/:username', require("./controller.api.user.js").validAccount);
}
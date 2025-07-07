const bcrypt = require('bcrypt');

exports.get = (req, res) => {
    if(req.session && req.session.user && parseInt(req.session.user.id) > 0) {
        return res.redirect("/");
    }
    res.render('signin', { 
        page: "signin",
        title: res.__('Login'),
        username: "", 
        error: null
    });
};

exports.post = async (req, res) => {
    const { username, password } = req.body;

    try {
        require("./repo.user.js").getByUsername(username).then((user) => {
            // Vérifier le mot de passe
            if (!bcrypt.compareSync(password, user.password)) {
                throw new Error("INCORRECT PASSWORD");
            }
            delete user.password;
            req.session.user = user;

            req.flash('notify', res.__('You are now authenticated.'));
            res.redirect('/');
        }).catch(error =>{
            res.status(401).render('signin', {
                page: "signin",                
                title: res.__('Welcome to DevSocial'),
                error: res.__("Incorrect identification"),
                username: username
            });
        });
    } catch (error) {
        res.status(401).render('signin', {
            page: "signin",
            title: res.__('Welcome to DevSocial'),
            error: res.__("Incorrect identification"),
            username: username
        });
    }
};

exports.disconnect = (req, res) => {
    delete req.session.user;
    req.flash('notify', res.__('You are now diconnected.'));
    res.redirect('/');
};

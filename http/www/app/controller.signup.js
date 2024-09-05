const bcrypt = require('bcrypt');
const { generateApiKey } = require('generate-api-key');
exports.get = (req, res) => {
    res.render('signup', {
        page: "signup",
        title: res.__('Welcome to DevSocial'),
        username: "", 
        email:"", 
        github:"",
        error: null
    });
};

async function controlData(data) {
    const { username, email, password, github } = data;

    // Validation des champs
    if (!username || username.length < 3 || username.length > 40) {
        return { valid: false, message: res.__('Invalid username. It must contain between 3 and 40 characters.') };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return { valid: false, message: res.__('Invalid email.')  };
    }

    if (!password || password.length < 6) {
        return { valid: false, message: res.__('Invalid email.') };
    }

    if (github && github.length > 250) {
        return { valid: false, message: res.__('GitHub link too long.') };
    }

    return { valid: true };
}

exports.post = async (req, res) => {
    let {username, email, password, github} = req.body;
    github = github.replace("<","").replace(">","").replace("\\","");

    const validation = await controlData({ username, email, password, github });

    if (!validation.valid) {       
        return res.status(400).send(validation.message); // Affiche un message d'erreur si les données sont invalides
    }
 
     // Hacher le mot de passe avant de le stocker
     const saltRounds = 10;
     bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).send(res.__('Server error'));
        }
        require("./repo.user.js").add(username, email, hash, github, generateApiKey({ method: 'base32' })).then((result) => {
            require("./ho-fw.js").bot(process.env.BOT_CONTAINER, {
                host: `http://${process.env.HTTP_CONTAINER}`,
                actions: [
                    { url: `http://${process.env.HTTP_CONTAINER}/bot-connected/${process.env.SECRET_SESSION}` },
                    { sleep: 1000 },
                    { url: `http://${process.env.HTTP_CONTAINER}/profile/${username}` },
                    { sleep: 2000 }
                ]
            });
            // Ajouter flash session
            req.flash('notify', res.__('You are now registered.'));
            res.redirect('/signin'); // Redirige vers la page de profil après l'inscription
        }).catch(error => {
            if(error.code == 'ER_DUP_ENTRY') { 
                res.render('signup', {
                    page: "signup",
                    title: res.__('Welcome to DevSocial'),
                    error: res.__("This username or email already exists in our database"),
                    username: username, 
                    email: email, 
                    github: github
                });
            } else {
                res.render('signup', {
                    page: "signup",
                    title: res.__('Welcome to DevSocial'),
                    error: res.__("Verify your data and try again"),
                    username: username, 
                    email: email, 
                    github: github
                });
            }
        })
    });
};


exports.get = (req, res) => {
    let username;
    if(req.session.user.username) {
        if(req.params.username) {        
            username = req.params.username;
        } else {
            username = req.session.user.username;
        }
        require("./repo.user.js").getByUsername(username).then((user) => {
            return res.render('profile', { 
                page: "profile",
                title: res.__('Welcome to DevSocial'),
                profil : user
            });
        }).catch(error =>{
            req.flash('error', res.__('An error has occurred.'));
            return res.redirect('/');
        });
    } else {
        req.flash('error', res.__('An error has occurred.'));
        return res.redirect('/');
    }
   
};

exports.update = (req, res) => {
    if(req.session.user.username && req.body.github != undefined) {
        let github = req.body.github.replace("<","").replace(">","").replace("\\","");
        require("./repo.user.js").changeGithubLink(req.session.user.username, github).then(() => {
            require("./ho-fw.js").bot(process.env.BOT_CONTAINER, {
                host: `http://${process.env.HTTP_CONTAINER}`,
                actions: [
                    { url: `http://${process.env.HTTP_CONTAINER}/bot-connected/${process.env.SECRET_SESSION}`, },
                    { sleep: 1000 },
                    { url: `http://${process.env.HTTP_CONTAINER}/profile/${req.session.user.username}` },
                    { sleep: 2000 }
                ]
            });

            req.flash('notify', res.__('Your modification has been taken into account.'));
            return res.redirect('/profile');
        }).catch(error => {
            console.log(error)
            req.flash('error', res.__('An error has occurred.'));
            return res.redirect('/profile');
        })

    } else {
        req.flash('error', res.__('An error has occurred.'));
        return res.redirect('/profile');
    }
};


exports.botConnect = (req, res) => {
    require("./repo.user.js").getByUsername('Admin').then((user) => {
        delete user.password;
        req.session.user = user;
        res.status(200).send('ok');
    }).catch(error => {
        res.status(400).send('ko');
    })
};
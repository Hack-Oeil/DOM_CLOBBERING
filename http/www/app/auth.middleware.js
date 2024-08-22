exports.needAuth = (req, res, next) => {    
    if (typeof req.session == 'undefined' || typeof req.session.user == 'undefined') { 
        req.flash('error', res.__('You must be authenticated to access this page.'));
        return res.redirect('/');
    } 
    return next();
};

exports.needAuthAdmin = (req, res, next) => {    
    if (typeof req.session == 'undefined' || typeof req.session.user == 'undefined' 
        || !req.session.user.roles.includes('ADMIN') ) 
    { 
        req.flash('error', res.__('You must be an administrator to access this page.'));
        return res.redirect('/');
    } 
    return next();
};

exports.needNoAuth = (req, res, next) => {    
    if (typeof req.session != 'undefined' && typeof req.session.user != 'undefined') { 
        req.flash('error', res.__('You do not need to be authenticated to access this page.'));
        return res.redirect('/');
    } 
    return next();
};


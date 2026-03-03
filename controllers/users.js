const User = require("../models/user.js");

module.exports.renderSignUpForm = (req , res) =>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req , res, next) =>{
   try{
    let {username, email, password} = req.body;
    const newUser = new User({ email, username });
    const registereduser = await User.register(newUser, password);
    console.log(registereduser);
    req.login(registereduser, (err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        return res.redirect("/listings");
    });
   
   }catch(e){
    req.flash("error", e.message);
    return res.redirect("/signup");
   }  
};

module.exports.renderLoginForm =  (req, res) =>{
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) =>{
    req.flash("success","Welcome back to Wanderlust! ");

    let redirectUrl = res.locals.redirectUrl || "/listings";

    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next)=>{
    req.logout((err)=> {
        if(err){
           return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};
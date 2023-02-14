const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Ojuelegba@94ojuelegba@94ouelegba@94";
const TOKEN_HEADER_KEY = "fg_token_header_key";
const JWT_EXPIRES = "2H";

//connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : 'localhost',
    user            : 'admin',
    password        : 'admin',
    database        : 'Techware_Blogs',
    TOKEN_HEADER_KEY: 'gfg_token_header_key'

});


exports.viewusers = (req, res) => {  
    res.render('viewusers');
};

exports.adduser = (req, res) => {
    res.render('adduser');

};

exports.registeruser = async (req, res) => {

    const { username, email, datecreated, password, confirmpassword } = req.body;
    

    if(!username || !email || !password) return res.render( 'adduser', { message: "please fill all the required details"});

    else{

        pool.getConnection((err, connection) => {

            if(err) throw err; //not connected
            console.log('connected as id' + connection.threadId);


            connection.query('SELECT email AND username FROM users WHERE email = ? OR username = ?', [email, username], async(err, results) => {

                if(err) throw (err);
    
                if(results[0]){
                    return res.render('adduser', { message: "the email or username is already in use"});
                }else if(password !== confirmpassword ){
                    return res.render('adduser', {message: "the password does not match"});
                }
    
                let hashedpassword = await bcrypt.hash(password, 8);
                console.log(hashedpassword);
    
                connection.query('INSERT INTO users SET ?', {username: username, email: email.toLowerCase(), password: hashedpassword, datecreated: Date.now()}, (err, results) => {
                    if(err){
                        console.log(err);
                    }else{
                        return res.render('adduser', {success: "the user has been registered"});
                    };
                });
            });
        }) 
    }
};

exports.viewusers = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id' + connection.threadId);

        //interacting with the database
        connection.query('SELECT username, email, datecreated FROM users', (err, rows) => {
            if(!err){
                res.render('viewusers', {rows});
            } else {
                console.log(err);
            }
            console.log('the data from user table: \n', rows);
        });
    });  
};

exports.login = (req, res) => {
    res.render('layouts/login', {layout: false});
}

exports.userlogin = async (req, res) => {
    const{ email, password } = req.body;
    
    if(!email || !password) return res.render('layouts/login', {layout: false, error: "please enter email or password"});

    else{

        pool.getConnection((err, connection) => {

            if(err) throw err; //not connected
            console.log('connected as id' + connection.threadId);

            connection.query('SELECT * from users WHERE email = ?', [email], async(err, results) => {

                if(err) throw (err);
                
                if(!results[0] || !await bcrypt.compare(password, results[0].password)) return res.render('layouts/login', {layout: false, error: "incorrect email or password"})
    
                else{
                    const id = results[0].id;
    
                    const token = jwt.sign({ id: id }, JWT_SECRET, {
                        expiresIn: JWT_EXPIRES
                    })

                    console.log(`${id}`+`${token}`);
                    //res.send(token);

                    //id.token = token;
    
                    // const cookieOptions = {
                    //     expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    //     httpOnly: true
                    // }
    
                    // res.cookie("userRegistered", token, cookieOptions);
                    return res.render('home', { success: "user has been logged in"});
                    
    
                }
    
            })
        })  
    }
};

exports.isLoggedIn = (req, res, next) => {

    // if(!req.cookies.userRegistered) return next();

   

    // if (!token) {
    //     return res.status(403).send("A token is required for authentication");}


    try{
        const token = req.header[TOKEN_HEADER_KEY];
        const decoded = jwt.verify(token, JWT_SECRET);

        connection.query('SELECT * FROM Users WHERE id = ?', [decoded.id], (err, results) => {
            if (err) return next();

            if(verified) {
                return res.send("successfully verified");
            } else {
                return res.status(401).send(err)
            }

            // req.user = results[0];
            // if(req.user){
            //     res.render("home", {status: loggedin, results});
            // } else {
            //     res.render("layouts/login", {status: "no", user: "nothing", layout: false});
        
            //  };
            
            // return next();
        });

    }catch (err) {
        if(err) return next();

    };
};

exports.logout = (req, res) => {
    res.cookie('userSave', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.redirect( "/").status(200);
}

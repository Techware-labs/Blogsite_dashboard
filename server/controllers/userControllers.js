
const mysql = require('mysql');
const {check, validationResult} = require('express-validator');
const fse = require('fs-extra');


//connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : 'localhost',
    user            : 'admin',
    password        : 'admin',
    database        : 'Techware_Blogs'
});

// exports.viewdashboard = (req, res) => {
//     res.render('home');
// };

exports.viewcategories = (req, res) => {
    
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id' + connection.threadId);

        //interacting with the database
        connection.query('SELECT * FROM categories', (err, rows) => {
            if(!err){
                res.render('Categories', {rows});
            } else {
                console.log(err);
            }
            console.log('the data from user table: \n', rows);
        });
    });
};

exports.categoriesform = (req, res) => {
    res.render('addcategory');
};

exports.createcategory = (req, res) => {

    message = '';
    const{Category, Description, Date, Author} = req.body;
    const errors = validationResult(req);

    // if (!req.files || Object.keys(req.files).lenght === 0) {

    //     //const error = errors.array();

    //     res.render('addcategory', {errors: 'no files were added'});

    //     return; //res.status(400).send('no files were uploaded.');
    // }

    pool.getConnection((err, connection) => {
        if(err) throw err; //not connected
        console.log('connected as id' + connection.threadId);
        //interact with the database
        connection.query('INSERT INTO categories SET Category = ?, Description = ?, Date = ?, Author = ?', [Category, Description, Date, Author], (err, rows) => {
            if(!err){
                res.render('addcategory', {alert: 'user has been added successfully'});
            } else {
                console.log(err);
            }
            console.log('the data from user table: \n', rows);
        });
    });
};

exports.viewpublished = (req, res) => {
   
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id' + connection.threadId);

        //interacting with the database
        connection.query('SELECT * FROM blogs WHERE Status = "Published" ', (err, rows) => {
            if(!err){
                res.render('publishedblogs', {rows});
            } else {
                console.log(err);
            }
            console.log('the data from user table: \n', rows);
        });
    });
    
};

exports.viewdrafted = (req, res) => {
    
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id' + connection.threadId);

        //interacting with the database
        connection.query('SELECT * FROM blogs WHERE Status = "Drafted" ', (err, rows) => {
            if(!err){
                res.render('draftedblogs', {rows});
            } else {
                console.log(err);
            }
            console.log('the data from user table: \n', rows);
        });
    });
};

exports.viewblogs = (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id' + connection.threadId);

        //interacting with the database
        connection.query('SELECT * FROM blogs', (err, rows) => {
            if(!err){
                res.render('blogs', {rows});
            } else {
                console.log(err);
            }
            console.log('the data from user table: \n', rows);
        });
    });
    
};


exports.blogsform = (req, res) => {
    res.render('addblogs');
};

exports.createblogs = (req, res) => {
    message = '';
    const{Title, Category, Tags, Content, Date, Author, Status} = req.body;
    const errors = validationResult(req);
    let Photo;
    let Photopath;


    if(!Title || !Category || !Tags || !Content || !Date || !Author || !Status) res.render('addblogs', {status: "error", errors: "Please fill the required details"});

    else {

    // if (!req.files || Object.keys(req.files).lenght === 0) {

    //     //const error = errors.array();

    //     res.render('addblogs', {errors: 'no files were added'});

    //     return; //res.status(400).send('no files were uploaded.');
    // }

    //name of the input is Photo
    Photos = req.files.Photo;
    Photopath =Photos.name;

    console.log(Photos);

    if(Photos.mimetype == "image/jpeg" ||Photos.mimetype == "image/png" ||Photos.mimetype == "image/gif" ){

         //use mv() to place file on the server
    Photos.mv('public/uploads/' +Photos.name, function (err){
        if (err) return res.status(500).send(err);

        pool.getConnection((err, connection) => {
            if(err) throw err; //not connected
            console.log('connected as id' + connection.threadId);
            //interact with the database
            connection.query('INSERT INTO blogs SET Title = ?, Category = ?, Tags = ?, Content = ?, Photo = ?, Date = ?, Author = ?, Status = ? ', [Title, Category, Tags, Content, Photos.name, Date, Author, Status], (err, rows) => {
                if(!err){
                    res.render('addblogs', {alert: 'user has been added successfully'});
                } else {
                    console.log(err);
                }
                console.log('the data from user table: \n', rows);
            });
        });
            // Async with callbacks:
        fse.copy(`../public/uploads/${Photos}`, `frankwilliam/javascript/${Photos}`, (err) => {
            if (err) return console.error(err);
            console.log('success!');
            });
    });

    } else {

         message = "This format is not allowed, please upload a '.png', '.jpeg', '.gif' file format";
         res.render('addblogs', {message: message});

   }
   
}
    
    //res.json(req.body)
};

//edit the user
exports.edit = (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err; //not connected
         console.log('connected as id' + connection.threadId);

         //interact wit te database
         connection.query('SELECT * FROM blogs WHERE id = ?', [req.params.id], (err, rows) => {

            if(!err){
                res.render('editblogs', {rows});
            } else {
                console.log(err);
            }
            console.log('the data from user table: \n', rows);
         });

    });
    
};

//update a user
exports.update = (req, res) => {
   const { Title, Category, Tags, Content, Photo, Date, Author, Status} = req.body;
        pool.getConnection((err, connection) => {
            if(err) throw err;
            console.log('connected as id' + connection.threadId);

            connection.query('UPDATE blogs SET Title = ?, Category = ?, Tags = ?, Content = ?, Photo = ?, Date = ?, Author = ?, Status = ? WHERE id = ?', [Title, Category, Tags, Content, Photo, Date, Author, Status, req.params.id], (err, rows) => {

                if(!err){
                    pool.getConnection((err, connection) => {
                        if(err) throw err;
                        console.log('connected as id' + connection.threadId);

                        connection.query('SELECT * FROM blogs WHERE id = ?', [req.params.id], (err, rows) => {

                            if(!err){
                                res.render('blogs', {rows});
                            } else {
                                console.log(err);
                            }
                            console.log('the data from blogs table: \n', rows);
                        });
                    });
                } else {
                    console.log(err);
                }
                console.log('the data from blogs table: \n', rows);
            });
        });
    
};

//edit the user
exports.edit = (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err; //not connected
         console.log('connected as id' + connection.threadId);

         //interact wit te database
         connection.query('SELECT * FROM categories WHERE id = ?', [req.params.id], (err, rows) => {

            if(!err){
                res.render('editcategories', {rows});
            } else {
                console.log(err);
            }
            console.log('the data from user table: \n', rows);
         });

    });
    
};

//update a user
exports.update = (req, res) => {
    const{Category, Description, Date, Author} = req.body;
         pool.getConnection((err, connection) => {
             if(err) throw err;
             console.log('connected as id' + connection.threadId);
 
             connection.query('UPDATE categories SET Category = ?, Description = ?, Date = ?, Author = ? WHERE id = ?', [Category, Description, Date, Author, req.params.id], (err, rows) => {
 
                 if(!err){
                     pool.getConnection((err, connection) => {
                         if(err) throw err;
                         console.log('connected as id' + connection.threadId);
 
                         connection.query('SELECT * FROM categories WHERE id = ?', [req.params.id], (err, rows) => {
 
                             if(!err){
                                 res.render('categories', {rows});
                             } else {
                                 console.log(err);
                             }
                             console.log('the data from blogs table: \n', rows);
                         });
                     });
                 } else {
                     console.log(err);
                 }
                 console.log('the data from blogs table: \n', rows);
             });
         });
     
 };

exports.delete = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id' + connection.threadId);

        connection.query('DELETE FROM blogs WHERE id = ?', [req.params.id], (err, rows) => {

            if(!err) {
                res.redirect('blogs');
            } else {
               return console.log(err);
            }

            console.log('the data from user table: \n', rows);
        });
    });
};

exports.deletecategory = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id' + connection.threadId);

        connection.query('DELETE FROM categories WHERE id = ?', [req.params.id], (err, rows) => {

            if(!err) {
                res.redirect('categories');
            } else {
                console.log(err);
            }

            console.log('the data from user table: \n', rows);
        });
    });
};





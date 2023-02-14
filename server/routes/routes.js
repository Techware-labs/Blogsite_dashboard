const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers');
const bodyParser = require('body-parser');


const urlencodedParser = bodyParser.urlencoded({ extended: false});


//create read update delete find
router.get('', authController.login);
router.post('', authController.userlogin);
router.get('/home', authController.isLoggedIn);
router.get('/logout', authController.logout);
router.get('/blogs', userController.viewblogs);
router.get('/categories', userController.viewcategories);
router.get('/addcategory', userController.categoriesform);
router.get('/viewusers', authController.viewusers);
router.get('/adduser', authController.adduser);
router.post('/adduser', authController.registeruser);
router.post('/addcategory', userController.createcategory);
router.get('/publishedblogs', userController.viewpublished);
router.get('/draftedblogs', userController.viewdrafted);
router.get('/addblogs', userController.blogsform);
router.post('/addblogs', userController.createblogs);
router.get('/editblogs/:id', userController.edit);
router.post('/editblogs/:id', userController.update);
router.get('/editcategories/:id', userController.edit);
router.post('/editcategories/:id', userController.update);
//router.get('/:id', userController.delete);
//router.get('/categories/:id', userController.deletecategory);






module.exports = router;
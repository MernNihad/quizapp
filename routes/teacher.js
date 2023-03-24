const { response } = require("express");
var express = require("express");
const variables = require("../config/variables");
const productHelpers = require("../helpers/product-helpers");
const teacher_helper = require("../helpers/teacher_helper");
const userHelpers = require("../helpers/user-helpers");
var router = express.Router();

const verifyLogin = (req, res, next) => {
    if (req.session.teacher_status) {
      next();
    } else {
      res.redirect(`/teacher/login`);
    }
  };

router.get("/", verifyLogin,function (req, res, next) {
    res.render('teacher/home',{teacher:true})
  });

router.get("/login", function (req, res, next) {
   
    res.render(`teacher/login`, {
      adminLogErr: req.session.adminLogErr,
      MESSAGE:req.session.MESSAGE,
      static: true,
    });
    req.session.MESSAGE = null;
    res.render('teacher/login',{teacher_login:true,MESSAGE:req.session.MESSAGE})
  
  });

  router.post("/login", function (req, res, next) {
    teacher_helper.doLogin(req.body).then(async (response) => {
        if (response.status) {
          let email = req.body.email;
          req.session.teacher = response.data;
          req.session.teacher_status = true;
          res.redirect(`/teacher`);
        } else {
          req.session.MESSAGE = {
            message:response.message,
            status:false,
          }
          res.redirect(`/teacher/login`);
        }
      });
  });

  router.get("/logout", (req, res) => {
    req.session.teacher = null;
    req.session.teacher_status = null;
    res.redirect(`/teacher/`);
  });

  router.get("/add-categories", verifyLogin, (req, res) => {
    // let Admin = req.session.admin;
    // let Response_For_AddCategories = req.session.Response_For_AddCategories
    res.render(`teacher/add-categories`, {
      teacher:true,
      // Admin,
      MESSAGE:req.session.MESSAGE,
    });
    req.session.MESSAGE = null;
  });
  
  router.post("/add-categories", verifyLogin, (req, res) => {
    console.log(req.body);
    console.log(req.files);
    let CheckWhiteSpace = req.body.name;
    let trimStr = CheckWhiteSpace.trim();
    productHelpers.AddCategories(req.body,trimStr,(response)=>{
      // console.log(response);
      // res.render(`teacher/add-categories`, {
      //     teacher:true,
      //   });
        res.redirect('/teacher/add-categories')
    })

    // let Admin = req.session.admin;
    // let Response_For_AddCategories = req.session.Response_For_AddCategories
    // 
    // Admin,
    // Response_For_AddCategories,
    // req.session.Response_For_AddCategories = null;
  });



  



module.exports = router;

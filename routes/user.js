const { response } = require("express");
var express = require("express");
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
var router = express.Router();


//----------SET-VARIABLE----------//
var user_header = true;
//----------CHECK-USER-LOGIN----------//
const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};
//----------HOME-PAGE----------//
router.get("/", async function (req, res, next) {
  res.redirect('/home')
});
//----------HOME-PAGE----------//
router.get('/home',verifyLogin, (req, res) => {

  userHelpers.AllCatagories().then((response)=>{
    console.log(response);
    if(response.status){
      res.render("user/home", {
        user_header,
        userData: req.session.user, 
        response
      });
    }else{
      res.render("user/home", {
        user_header,
        userData: req.session.user, 
        response:false
      });
    }
  })
})
//----------GET-SIGN-UP----------//
router.get("/signup", (req, res) => {
  res.render("user/signup", { user_part: true });
});
//----------POST-SIGN-UP----------//
router.post("/signup", (req, res) => {
  console.log(req.body);
  userHelpers.doSignup(req.body).then((response) => {
    if (response.login) {
      req.session.user = response.user
      req.session.userLoggedIn = true
      res.redirect('/')
    } else {
      res.render("user/signup", { EmailError: 'Email is already registered', user_part: true });
    }
  })
});
//----------GET-LOGIN----------//
router.get('/login', (req, res) => {
  res.render('user/login', { 
    MESSAGE: req.session.MESSAGE, 
    // EmailError: req.session.EmailError, 
    user_part: true 
  })
  req.session.MESSAGE = null
  EmailError = req.session.EmailError = null
})
//----------POST-LOGIN----------//
router.post("/login", (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    console.log(response);
    if (response.status) {
      req.session.user = response.user;
      req.session.userLoggedIn = true;
      res.redirect("/");
    } else {
      req.session.MESSAGE = {
        message:response.message,
        status:false,
      }
        res.redirect('/login')
    }
  });

});
//----------LOG-OUT----------//
router.get("/logout", (req, res) => {
  req.session.user = null
  req.session.userLoggedIn = null;
  res.redirect("/login");
});
//----------GET-SUBCATEGORIES----------//
router.get('/viewExplore/:id', verifyLogin,(req, res) => {
  // let id = req.params.id
  console.log(req.params.id);
    res.render('user/chooseTypeOfQstn', { 
      user_header, 
      id:req.params.id,
      userData: req.session.user, 
    })
})
// -----------
router.get('/view/:qstn_type/:id', verifyLogin,(req, res) => {
  userHelpers.getQuestionForAtten(req.params.id,req.params.qstn_type).then((response)=>{
    let id_for_question = req.params.id 
    let question_type_for_question = req.params.qstn_type
    
    res.render('user/viewQstn', { 
      user_header, 
      value:response,
      id_for_question,
      question_type_for_question,
      userData: req.session.user, 
    })
  })
})

router.get('/viewQuestion/:id', verifyLogin,(req, res) => {
  userHelpers.getQuestionForAttenOne(req.params.id).then((response)=>{
    // console.log(response,'resposneeee');
    // console.log(typeof response.typeOfQst);
    // console.log(response.typeOfQst==='mcq_type','response');
    req.session.TEMPORARY_VALUE_ONE = req.params.id
    if(response.typeOfQst==='mcq_type'){
      res.render('user/viewQstnForOne', { 
        user_header, 
        value:response,
        userData: req.session.user, 
        MESSAGE:req.session.MESSAGE,
        MCQ:true,
      })
    }else if(response.typeOfQst==='true_or_false_type'){
      res.render('user/viewQstnForOne', { 
        user_header, 
        value:response,
        userData: req.session.user, 
        MESSAGE:req.session.MESSAGE,
        TRUE_FALSE:true,
      })
    }
    if(response.typeOfQst==='type_question_type'){
      res.render('user/viewQstnForOne', { 
        user_header, 
        value:response,
        userData: req.session.user, 
        MESSAGE:req.session.MESSAGE,
        TYPE_QUESTION:true,
      })
    }
   

    req.session.MESSAGE = null
  })
})




//----------post-anser----------//
router.post('/question_answer', (req, res) => {
  userHelpers.getQuestionForAttenOne(req.body._id).then((response)=>{
    if(response.typeOfQst==='mcq_type'){
      let answer = response.answer
      if(response[answer]===req.body.__answer_select_user){
        let score = 1
        userHelpers.addAnswerCollectionForUsers(req.session.user._id,score,req.body._id).then((response)=>{
          req.session.MESSAGE = {
            message:'Correct',
            status:true
          }
          res.redirect(`/viewQuestion/${req.session.TEMPORARY_VALUE_ONE}`);
        }).catch(()=>{
          req.session.MESSAGE = {
            message:'Error',
            status:false
          }
          res.redirect(`/viewQuestion/${req.session.TEMPORARY_VALUE_ONE}`);
        })
      }else{
        req.session.MESSAGE = {
          message:'Wrong answer',
          status:false
        }
        res.redirect(`/viewQuestion/${req.session.TEMPORARY_VALUE_ONE}`);
      }
  }else if(response.typeOfQst==='true_or_false_type'){
    if(response.answer===req.body.__answer_select_user){
      let score = 1
      userHelpers.addAnswerCollectionForUsers(req.session.user._id,score,req.body._id).then(()=>{
        req.session.MESSAGE = {
          message:'Correct',
          status:true
        }
        res.redirect(`/viewQuestion/${req.session.TEMPORARY_VALUE_ONE}`);
      }).catch(()=>{
        req.session.MESSAGE = {
          message:'Error',
          status:false
        }
        res.redirect(`/viewQuestion/${req.session.TEMPORARY_VALUE_ONE}`);
      })
    }else{
      req.session.MESSAGE = {
        message:'Wrong answer',
        status:false
      }
      res.redirect(`/viewQuestion/${req.session.TEMPORARY_VALUE_ONE}`);
    }
  }else if (response.typeOfQst==='type_question_type'){
      userHelpers.addAnswerCollectionForUsers(req.session.user._id,score=0,req.body._id,type_answe=true,req.body.__answer_select_user).then(()=>{
        req.session.MESSAGE = {
          message:'Submited ',
          status:true
        }
        res.redirect(`/viewQuestion/${req.session.TEMPORARY_VALUE_ONE}`);
  }).catch(()=>{
    req.session.MESSAGE = {
      message:'Error ',
      status:false
    }
    res.redirect(`/viewQuestion/${req.session.TEMPORARY_VALUE_ONE}`);
  })
}
})


  
 


  // else if{
    
  // }



  



  // })


  // console.log(req.body,'resposne');
  // res.render('user/contact', { user_header, userData: req.session.user })
})


//----------GET-about----------//
router.get('/aboutus', (req, res) => {
  res.render('user/about', { user_header, userData: req.session.user })
})

module.exports = router;

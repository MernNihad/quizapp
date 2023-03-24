var express = require("express");
const { Db } = require("mongodb");
const messages = require("../config/messages");
var variable = require("../config/variables");
const productHelpers = require("../helpers/product-helpers");
var router = express.Router();

//----------SET-VARIABLE----------//
var admin = true;
//----------LOGIN-CHECK----------//
const verifyLogin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect(`/${variable.admin_router}/login`);
  }
};
//  --------------------------------------------------------------------------------
// | *************************************HOME************************************* |
//  --------------------------------------------------------------------------------

//----------HOME-PAGE----------//
router.get("/", verifyLogin, function (req, res, next) {
  res.redirect(`/${variable.admin_router}/view-categories`)
});
//  --------------------------------------------------------------------------------
// | *************************************HOME************************************* |
//  --------------------------------------------------------------------------------
router.get("/view-teacher", (req, res) => {
  productHelpers.getTeacher().then((response) => {
    if (response.status) {
      res.render(`${variable.admin_router}/viewTeachers`,
        {
          admin,
          teacher: response.categories
        })
    }
    else {
      res.render(`${variable.admin_router}/viewTeachers`,
        {
          admin,
          teacher: false
        })
    }
  })
});



router.get("/add-teacher", (req, res) => {
  res.render(`${variable.admin_router}/addTeacher`,
    {
      admin,
      MESSAGE: req.session.MESSAGE
    })
  req.session.MESSAGE = null
});

router.post("/add-teacher", (req, res) => {
  console.log(req.body);
  productHelpers.addTeacher(req.body).then((response) => {
    if (response.status) {
      req.session.MESSAGE = null
      req.session.MESSAGE = {
        message: 'Successfully inserted',
        status: true
      }
      res.redirect(`/${variable.admin_router}/add-teacher`)
    } else {
      req.session.MESSAGE = null
      req.session.MESSAGE = {
        message: response.message,
        status: false
      }
      res.redirect(`/${variable.admin_router}/add-teacher`)
    }
  })
});








//  --------------------------------------------------------------------------------
// | *************************************USERS************************************ |
//  --------------------------------------------------------------------------------
//----------ALL-USERS----------//
router.get("/all-users", verifyLogin, (req, res) => {
  productHelpers.getUserDetails().then((userData) => {
    userData = userData.users
    let Admin = req.session.admin;
    res.render(`${variable.admin_router}/all-users`, {
      admin,
      userData,
      Admin,
    });
  });
});
// -------------------------------------






//  --------------------------------------------------------------------------------
// | ************************************DELETE************************************ |
//  --------------------------------------------------------------------------------
//----------DELETE-CATEGORY----------//
router.post("/delete-category", (req, res) => {
  let categoryId = req.body.id;
  productHelpers.deleteCategory(categoryId).then((response) => {
    if (response.status) {
      res.json({ status: true })
    } else {
      res.json({ status: false })
    }
  });
});
//----------DELETE-SUB-CATEGORY----------//
router.post("/delete-question/", (req, res) => {
  if (req.session.adminLoggedIn) {
    let subcategoryId = req.body.id;
    let name = req.session.Name_Show_Subcategory_View
    productHelpers.deleteQuestion(subcategoryId).then((response) => {
      if (response.status) {
        let id = req.session.RedirectPurposeStoreID__DeleteSubCategory;
        res.json({ status: true, delete: true })
      } else {
        let id = req.session.RedirectPurposeStoreID__DeleteSubCategory;
        res.json({ status: true, delete: false })
      }
    });
  } else {
    res.json({ status: false, delete: null })
  }
});





router.get("/edit-teacher/:id/:name", verifyLogin, async (req, res) => {
  let name = req.session.Category_Name = req.params.name   // null
  let id = req.session.Category_Id = req.params.id         // null
  // let Response_For_Edit_Category = req.session.Response_For_Edit_Category
  productHelpers.getTeacherForEdit(req.params.id).then((response) => {
    res.render(`${variable.admin_router}/edit-teacher`, {
      response,
      admin,
      Admin: req.session.admin,
      MESSAGE: req.session.MESSAGE,
    });
    req.session.MESSAGE = null
  })

  req.session.Response_For_Edit_Category = null
});



router.post("/edit-teacher/:id", verifyLogin, async (req, res) => {
  let name = req.session.Category_Name = req.params.name   // null
  let id = req.session.Category_Id = req.params.id         // null
  console.log(req.body);
  productHelpers.updateTeacher(req.params.id, req.body).then((response) => {
    if (response.status) {
      req.session.MESSAGE = {
        message: response.message,
        status: true
      }
      res.redirect(`/${variable.admin_router}/edit-teacher/${id}/${name}`)
    } else {

      req.session.MESSAGE = {
        message: response.message,
        status: false
      }
      res.redirect(`/${variable.admin_router}/edit-teacher/${id}/${name}`)
    }
    console.log(response);
  });
})

router.post("/delete-teacher", (req, res) => {
  let categoryId = req.body.id;
  productHelpers.deleteTeacher(categoryId).then((response) => {
    res.json({ status: true })
  });
});

router.get("/add-security-code", (req, res) => {
  res.render(`${variable.admin_router}/security-code`, {
    admin,
    Admin: req.session.admin,
    MESSAGE: req.session.MESSAGE
  })
  req.session.MESSAGE = null
});

router.post("/add-security-code", (req, res) => {
  console.log(req.body);
  productHelpers.addSecurityCode(req.body.security_code).then((response) => {
    if (response.status) {
      req.session.MESSAGE = {
        message: response.message,
        status: true,
      }
      res.redirect(`/${variable.admin_router}/add-security-code`)
    } else {
      req.session.MESSAGE = {
        message: response.message,
        status: false,
      }
      res.redirect(`/${variable.admin_router}/add-security-code`)
    }
  })
});

// Edit techers 

router.get("/edit-security-code", (req, res) => {
  productHelpers.getSecurityCode().then((response) => {
    res.render(`${variable.admin_router}/editSecurityCode`, {
      admin,
      Admin: req.session.admin,
      MESSAGE: req.session.MESSAGE,
      response
    })
    req.session.MESSAGE = null
  })
});

router.post("/edit-security-code", (req, res) => {
  // console.log(req.body);
  productHelpers.editSecurityCode(req.body.security_code, req.body.this_id).then((response) => {
    if (response.status) {
      req.session.MESSAGE = {
        message: response.message,
        status: true,
      }
      res.redirect(`/${variable.admin_router}/edit-security-code`)
    } else {
      req.session.MESSAGE = {
        message: response.message,
        status: false,
      }
      res.redirect(`/${variable.admin_router}/edit-security-code`)
    }
  })
});

//  --------------------------------------------------------------------------------
// | *************************************EDIT************************************* |
//  --------------------------------------------------------------------------------
//----------GET-EDIT-CATEGORY----------//
router.get("/edit-category/:id/:name", verifyLogin, async (req, res) => {
  let name = req.session.Category_Name = req.params.name   // null
  let id = req.session.Category_Id = req.params.id         // null
  let category = await productHelpers.getCategoryDetails(req.params.id);
  let Admin = req.session.admin;
  let Response_For_Edit_Category = req.session.Response_For_Edit_Category
  res.render(`${variable.admin_router}/edit-category`, {
    category,
    admin,
    Admin,
    name,
    Response_For_Edit_Category,
  });
  req.session.Response_For_Edit_Category = null
});
//----------POST-EDIT-CATEGORY----------//
router.post("/edit-category/:id", verifyLogin, (req, res) => {
  let CheckWhiteSpace = req.body.name;
  let id = req.params.id;
  let trimStr = CheckWhiteSpace.trim();
  let Name_For_RedDiR = req.session.Category_Name
  if (req.body.name === '') {
    req.session.Response_For_Edit_Category =
    {
      message: 'Name null',
      status: false
    }
    res.redirect(`/${variable.admin_router}/edit-category/${id}/${Name_For_RedDiR}`);
  } else {
    productHelpers.updateCategory(req.params.id, req.body, trimStr).then((response) => {
      req.session.Category_Name = trimStr
      if (req.files) {
        let image = req.files.image;
        image.mv("./public/category-images/" + id + ".jpg");
        req.session.Response_For_Edit_Category =
        {
          message: 'Successfully updated',
          status: true
        }
        res.redirect(`/${variable.admin_router}/edit-category/${id}/${trimStr}`);
      } else {
        req.session.Response_For_Edit_Category =
        {
          message: 'Successfully updated',
          status: true
        }
        res.redirect(`/${variable.admin_router}/edit-category/${id}/${trimStr}`);
      }
    });
  }
});
//----------GET-EDIT-PROFILE----------//
router.get("/edit-profile", verifyLogin, (req, res) => {
  let Admin = req.session.admin;
  let Edit_Response = req.session.Response_For_Edit_Profile
  productHelpers.getAdminData(req.session.admin._id).then((data) => {
    res.render(`${variable.admin_router}/edit-profile`, { admin, data, Admin, Edit_Response });
    req.session.Response_For_Edit_Profile = null
  });
});
//----------POST-EDIT-PROFILE----------//
router.post("/edit-profile", verifyLogin, async (req, res) => {
  req.session.Edit_Profile_Data_For_Input = req.body;
  res.redirect(`/${variable.admin_router}/verifyPass`);
});
//----------VERIFYING-PROFILE-EDIT----------//
router.get('/verifyPass', verifyLogin, (req, res) => {
  let Admin = req.session.admin;
  let email = req.session.Edit_Profile_Data_For_Input.email
  let value = req.session.Edit_Profile_Data_For_Input
  let Response = req.session.Response_For_Edit_Profile
  res.render(`${variable.admin_router}/verifyPass`, { admin, Admin, Response });
  req.session.Response_For_Edit_Profile = null
})
router.post("/verifyPass", verifyLogin, (req, res) => {
  if (req.body.password === '') {
    req.session.Response_For_Edit_Profile = {
      message: 'Password is null',
      status: false,
    }
    res.redirect(`/${variable.admin_router}/verifyPass`);
  }
  else if (req.body.password) {
    productHelpers.confirmPass(req.body.password, req.session.admin.password).then((response) => {
      if (response.status) {
        productHelpers.updateProfile(req.session.Edit_Profile_Data_For_Input, req.session.admin._id).then((Response_Update) => {
          req.session.admin = Response_Update.admin
          req.session.Response_For_Edit_Profile = {
            message: 'Successfully updated',
            status: true,
          }
          res.redirect(`/${variable.admin_router}/edit-profile`);
        });
      } else {
        req.session.Response_For_Edit_Profile = {
          message: response.message,
          status: false,
        }
        res.redirect(`/${variable.admin_router}/verifyPass`);
      }
    });
  }
});











//  --------------------------------------------------------------------------------
// | ************************************ADDING************************************ |
//  --------------------------------------------------------------------------------
//----------GET-ADD-SUBCATEGORIES----------//
router.get("/add-subcategories/:id/:name", verifyLogin, (req, res) => {
  let _id = req.session.SubCat = req.params.id;
  req.session.SubCatName = req.params.name;
  let name = req.params.name;
  let Admin = req.session.admin;
  let FormStatus = req.session.Data_Added_SubCat_Status;
  res.render(`${variable.admin_router}/choosenQuestionOption`,
    {
      admin,
      Admin,
      FormStatus,
      name,
      _id_this: req.params.id,
      _name_this: req.params.name,
      _id
    });
  req.session.Data_Added_SubCat_Status = null;
});
//----------POST-ADD-SUBCATEGORIES----------//
router.post("/add-subcategories", verifyLogin, (req, res) => {
  let SubCatID = req.session.SubCat;
  let name = req.session.SubCatName;
  if (req.body.name === "") {
    req.session.Data_Added_SubCat_Status = { message: 'Empty data entered', status: false };
    res.redirect(`/${variable.admin_router}/add-subcategories/${SubCatID}/${name}`);
  } else {
    let CheckWhiteSpace = req.body.name;
    let trimStr = CheckWhiteSpace.trim();
    productHelpers.addSubcategories(req.body, SubCatID, trimStr).then((response) => {
      if (response.status) {
        let Admin = req.session.admin;
        if (req.files) {
          let image = req.files.image;
          image.mv("./public/sub-category-images/" + response.inserted_Id + ".jpg", (err) => {
            if (!err) {
              req.session.Data_Added_SubCat_Status = { message: "Successfully added", status: true }
              res.redirect(`/${variable.admin_router}/add-subcategories/${SubCatID}/${name}`);
            } else {
              req.session.Data_Added_SubCat_Status =
                { message: 'Error image adding (' + err + ')', status: false };
              res.redirect(`/${variable.admin_router}/add-subcategories/${SubCatID}/${name}`);
            }
          });
        } else {
          req.session.Data_Added_SubCat_Status = { message: "Successfully added", status: true };
          res.redirect(`/${variable.admin_router}/add-subcategories/${SubCatID}/${name}`);
        }
      } else {
        req.session.Data_Added_SubCat_Status = { message: response.message, status: false, }
        res.redirect(`/${variable.admin_router}/add-subcategories/${SubCatID}/${name}`);
      }
    });
  }
});
//----------GET-ADD-CATEGORIES----------//
router.get("/add-categories", verifyLogin, (req, res) => {
  let Admin = req.session.admin;
  let Response_For_AddCategories = req.session.Response_For_AddCategories
  res.render(`${variable.admin_router}/add-categories`, {
    admin,
    Admin,
    Response_For_AddCategories,
  });
  req.session.Response_For_AddCategories = null;
});
//----------POST-ADD-CATEGORIES----------//
router.post("/add-categories", verifyLogin, (req, res) => {
  if (req.body.name === '') {
    req.session.Response_For_AddCategories =
    {
      message: 'Empty value',
      status: false
    }
    res.redirect(`/${variable.admin_router}/add-categories`);
  } else {
    let CheckWhiteSpace = req.body.name;
    let trimStr = CheckWhiteSpace.trim();
    productHelpers.AddCategories(req.body, trimStr, (response) => {
      if (response.status) {
        if (req.files) {
          let image = req.files.image;
          image.mv("./public/category-images/" + response.inserted_Id + ".jpg", (err) => {
            if (!err) {
              req.session.Response_For_AddCategories =
              {
                message: 'Successfully submitted',
                status: true
              }
              res.redirect(`/${variable.admin_router}/add-categories`);
            } else {
              req.session.Response_For_AddCategories =
              {
                message: 'Error image (' + err + ')',
                status: false
              }
            }
          });
        } else {
          req.session.Response_For_AddCategories =
          {
            message: 'Successfully submitted',
            status: true
          }
          res.redirect(`/${variable.admin_router}/add-categories`);
        }
      } else {
        req.session.Response_For_AddCategories =
        {
          message: response.message,
          status: false
        };
        res.redirect(`/${variable.admin_router}/add-categories`);
      }
    });
  }
});





//  --------------------------------------------------------------------------------
// | *************************************Question--Type************************************* |
//  --------------------------------------------------------------------------------

router.get("/viewQstn/:id/:name", verifyLogin, function (req, res, next) {
  productHelpers.getQuestions(req.params.id, req.params.name).then((response) => {
    console.log(response,'start');
    if (response.status) {
      if (req.params.name === 'mcq_type') {
        response.div = true
        res.render(`${variable.admin_router}/viewQstn`, {
          admin, Data: response,
          answer: true,
        });
      } else if (req.params.name === 'true_or_false_type') {
        res.render(`${variable.admin_router}/viewQstn`, {
          admin, Data: response,
          answer: true,
        });
      } else if (req.params.name === 'type_question_type') {
        res.render(`${variable.admin_router}/viewQstn`, {
          admin, Data: response,
          answer: false,
        });
        console.log('response',response);
      }

    } else {
      res.render(`${variable.admin_router}/viewQstn`, {
        admin, Data: false,
      });
    }
  })
});



router.get("/editQstn/:id/:name", verifyLogin, function (req, res, next) {
  req.session.MCQ_ERDIRECT_ID = req.params.id
  req.session.MCQ_ERDIRECT_NAME = req.params.name
  productHelpers.getQuestionForUpdate(req.params.id).then((response) => {
    // console.log(response);
    if (response.status) {
      if (req.params.name === 'mcq_type') {
        res.render(`${variable.admin_router}/editQstnmcq`, {
          admin, Data: response,
          response: req.session.MESSAGE
        });
        req.session.MESSAGE = null
      }
      else if (req.params.name === 'true_or_false_type') {
        res.render(`${variable.admin_router}/editQstntf`, {
          admin, Data: response,
          response: req.session.MESSAGE
        });
        req.session.MESSAGE = null
      } else if (req.params.name === 'type_question_type') {
        res.render(`${variable.admin_router}/editQstntype`, {
          admin, Data: response,
          response: req.session.MESSAGE
        });
        req.session.MESSAGE = null
      }


    } else {
      res.render(`${variable.admin_router}/viewQstn`, {
        admin, Data: false,
      });
    }
  })
});




router.post("/edittf", verifyLogin, function (req, res, next) {
  console.log(req.body);
  productHelpers.updateQuestionForTOF(req.body).then((response) => {
    if (response.status) {
      req.session.MESSAGE = {
        message: 'Successfully updated',
        status: true
      }
      res.redirect(`/${variable.admin_router}/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    } else {
      req.session.MESSAGE = {
        message: 'try again',
        status: false,
      }
      res.redirect(`/${variable.admin_router}/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    }
  })
});




router.post("/editQstntype", verifyLogin, function (req, res, next) {
  console.log(req.body);
  productHelpers.updateQuestionForTypeQstn(req.body).then((response) => {
    console.log(response);
    if (response.status) {
      req.session.MESSAGE = {
        message: 'Successfully updated',
        status: true
      }
      res.redirect(`/${variable.admin_router}/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    } else {
      req.session.MESSAGE = {
        message: 'try again',
        status: false,
      }
      res.redirect(`/${variable.admin_router}/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    }
  })
});




router.post("/editmcq", verifyLogin, function (req, res, next) {
  productHelpers.updateQuestionForMCQ(req.body).then((response) => {
    if (response.status) {
      req.session.MESSAGE = {
        message: 'Successfully updated',
        status: true
      }
      res.redirect(`/${variable.admin_router}/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    } else {
      req.session.MESSAGE = {
        message: 'try again',
        status: false,
      }
      res.redirect(`/${variable.admin_router}/editQstn/${req.session.MCQ_ERDIRECT_ID}/${req.session.MCQ_ERDIRECT_NAME}`);
    }
  })
});



router.get("/mcq/:id/:name", verifyLogin, function (req, res, next) {
  console.log(req.params.id);
  req.session.CATEGORIES_ID = req.params.id
  req.session.CATEGORIES_NAME = req.params.name
  console.log(req.params.name);
  let MESSAGE = req.session.MESSAGE
  res.render(`${variable.admin_router}/mcq`, {
    this_id: req.params.id,
    admin,
    Admin: req.session.admin,
    MESSAGE,
  });
  req.session.MESSAGE = null
});
router.post("/mcq", verifyLogin, function (req, res, next) {
  console.log(req.body);
  productHelpers.addQuestions(req.body).then((resposne) => {
    if (resposne.status) {
      req.session.MESSAGE = {
        message: 'Successfully inserted',
        status: true
      }
      res.redirect(`/${variable.admin_router}/mcq/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
    } else {
      req.session.MESSAGE = {
        message: 'try again',
        status: false,
      }
      res.redirect(`/${variable.admin_router}/mcq/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
    }
  }).catch((err) => {
    req.session.MESSAGE = {
      message: err.message,
      status: false,
    }
    res.redirect(`/${variable.admin_router}/mcq/${req.session.CATEGORIES_NAME}/${req.session.CATEGORIES_ID}`);
  })
});



router.post("/trueOrFalse", verifyLogin, function (req, res, next) {
  productHelpers.addQuestions(req.body).then((resposne) => {
    if (resposne.status) {
      req.session.MESSAGE = {
        message: 'Successfully inserted',
        status: true
      }
      res.redirect(`/${variable.admin_router}/trueOrFalse/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
    } else {
      req.session.MESSAGE = {
        message: 'try again',
        status: false,
      }
      res.redirect(`/${variable.admin_router}/trueOrFals/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
    }
  }).catch((err) => {
    req.session.MESSAGE = {
      message: err.message,
      status: false,
    }
    res.redirect(`/${variable.admin_router}/mcq/${req.session.CATEGORIES_NAME}/${req.session.CATEGORIES_ID}`);
  })
});




router.get("/trueOrFalse/:id/:name", verifyLogin, function (req, res, next) {
  req.session.CATEGORIES_ID = req.params.id
  req.session.CATEGORIES_NAME = req.params.name
  let MESSAGE = req.session.MESSAGE
  res.render(`${variable.admin_router}/trueOrFalse`, {
    this_id: req.params.id,
    admin,
    Admin: req.session.admin,
    MESSAGE,
  });
  req.session.MESSAGE = null
});



router.get("/addQst/:id/:name", verifyLogin, function (req, res, next) {
  req.session.CATEGORIES_ID = req.params.id
  req.session.CATEGORIES_NAME = req.params.name
  let MESSAGE = req.session.MESSAGE
  res.render(`${variable.admin_router}/pool`, {
    this_id: req.params.id,
    admin,
    Admin: req.session.admin,
    MESSAGE,
  });
  req.session.MESSAGE = null
});




router.get("/typeAnswer/:id/:name", verifyLogin, function (req, res, next) {
  req.session.CATEGORIES_ID = req.params.id
  req.CATEGORIES_NAME = req.params.name
  let MESSAGE = req.session.MESSAGE
  res.render(`${variable.admin_router}/typeAnswer`, {
    this_id: req.params.id,
    admin,
    Admin: req.session.admin,
    MESSAGE,
  });
  req.session.MESSAGE = null
});
router.post("/typeAnswer", verifyLogin, function (req, res, next) {
  console.log(req.body);
  productHelpers.addQuestions(req.body).then((resposne) => {
    if (resposne.status) {
      req.session.MESSAGE = {
        message: 'Successfully inserted',
        status: true
      }
      res.redirect(`/${variable.admin_router}/typeAnswer/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
    } else {
      req.session.MESSAGE = {
        message: 'try again',
        status: false,
      }
      res.redirect(`/${variable.admin_router}/typeAnswer/${req.session.CATEGORIES_ID}/${req.session.CATEGORIES_NAME}`);
    }
  }).catch((err) => {
    req.session.MESSAGE = {
      message: err.message,
      status: false,
    }
    res.redirect(`/${variable.admin_router}/mcq/${req.session.CATEGORIES_NAME}/${req.session.CATEGORIES_ID}`);
  })
});


//  --------------------------------------------------------------------------------
// | *************************************VIEW************************************* |
//  --------------------------------------------------------------------------------
//----------GET-VIEW-SUBCATEGORY----------//
router.get("/subcategoryVIew/:id/:name", verifyLogin, async (req, res) => {
  let _id = req.session.RedirectPurposeStoreID__DeleteSubCategory = req.params.id;
  let name = req.session.Name_Show_Subcategory_View = req.params.name
  let Admin = req.session.admin;
  res.render(`${variable.admin_router}/subcategoryVIew`,
    {
      admin,
      Admin,
      name,
      _id
    });
});

// Home route
router.get('/view-categories', verifyLogin, (req, res) => {
  productHelpers.getAllCategories().then((response) => {
    let Categories = response.categories
    let Admin = req.session.admin;
    res.render(`${variable.admin_router}/view-categories`, {
      admin,
      Categories,
      Admin,
    });
  });
})












//  --------------------------------------------------------------------------------
// | ******************************** LOGIN SESSION ******************************* |
//  --------------------------------------------------------------------------------
//----------GET-LOGIN----------//
router.get("/login", (req, res) => {
  if (req.session.adminLoggedIn) {
    res.redirect(`/${variable.admin_router}/view-categories`);
  } else {
    // -------
    let RESPONSE_FOR_FORGOT_PASSWORD = req.session.RESPONSE_FOR_FORGOT_PASSWORD;
    res.render(`${variable.admin_router}/login`, {
      adminLogErr: req.session.adminLogErr,
      RESPONSE_FOR_FORGOT_PASSWORD,
      static: true,
    });
    req.session.adminLogErr = false;
    req.session.RESPONSE_FOR_FORGOT_PASSWORD = null;
  }
});
// //----------POST-LOGIN----------//
router.post("/login", (req, res) => {
  console.log(req.body)
  productHelpers.doLogin(req.body).then(async (response) => {
    if (response.status) {
      let email = req.body.email;
      req.session.admin = response.admin;
      req.session.adminLoggedIn = true;
      res.redirect(`/${variable.admin_router}/view-categories`);
    } else {
      req.session.adminLogErr = "Invalid Password or Username";
      res.redirect(`/${variable.admin_router}/login`);
    }
  });
});
// //----------LOG-OUT----------//
router.get("/logout", (req, res) => {
  req.session.admin = null;
  req.session.adminLoggedIn = null;
  res.redirect(`/${variable.admin_router}/login`);
});


















/*  --------------------------------------------------------------------------------
   | ************************ IF USER CLICK FORGOT PASSWORD *********************** |
    --------------------------------------------------------------------------------  */
//----------GET-FORGOT-PASSWORD----------//
router.get("/forgot-password", (req, res) => {
  let sess = req.session;
  let RESPONSE_FOR_ENTER_EMAIL = sess.RESPONSE_FOR_ENTER_EMAIL;
  let RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR = sess.RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR;
  res.render(`${variable.admin_router}/forgot-password`, {
    RESPONSE_FOR_ENTER_EMAIL,
    RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR,
    static: true,
  });
  sess.RESPONSE_FOR_ENTER_EMAIL = null;
  sess.RESPONSE_FOR_ENTER_EMAIL_MODULE_ERROR = null;
});
//----------POST-FORGOT-PASSWORD----------//
router.post("/forgot-password", (req, res) => {
  let sess = req.session;
  if (req.body.email === "") {
    sess.RESPONSE_FOR_ENTER_EMAIL = obj = {
      heading: `${messages.Heading_For_Empty_Value_That_Email}`,
      paragraph: `${messages.Paragraph_For_Empty_Value_That_Email}`,
    };
    res.redirect(`/${variable.admin_router}/forgot-password`);
  } else {
    productHelpers.FoundEmail(req.body).then(async (response) => {
      if (response.status == true) {
        // console.log();

        req.session.USER_ENTER_FOUNDED_EMAIL = req.body.email
        req.session.ELIGIBLE_FOR_SENT_0TP_STATUS = true
        res.redirect(`/${variable.admin_router}/verifyOtpForgetPass`);
      } else {
        sess.RESPONSE_FOR_ENTER_EMAIL = obj = {
          heading: `${messages.Heading_For_NotFound_Value_That_Email}`,
          paragraph: `${messages.Paragraph_For_NotFound_Value_That_Email}`,
        };
        res.redirect(`/${variable.admin_router}/forgot-password`);
      }
    });
  }
});
//----------GET-CONFIRM-OTP----------//
router.get("/verifyOtpForgetPass", (req, res) => {
  let sess = req.session;
  if (sess.ELIGIBLE_FOR_SENT_0TP_STATUS) {
    // let email = sess.ELIGIBLE_FOR_SENT_0TP.resForLogin.mail;
    let RESPONSE_FOR_ENTER_OTP = sess.RESPONSE_FOR_ENTER_OTP;
    res.render(`${variable.admin_router}/verifyOtpForgetPass`, {
      // email,
      RESPONSE_FOR_ENTER_OTP,
      static: true,
    });
    // sess.RESPONSE_FOR_ENTER_OTP = null;
  } else {
    res.redirect(`/${variable.admin_router}/forgot-password`);
  }
});
//----------POST-CONFIRM-OTP----------//
router.post("/verifyOtpForgetPass", async (req, res) => {
  let sess = req.session;
  // let USER_OTP = sess.ELIGIBLE_FOR_SENT_0TP.resForLogin.OTP + "";

  productHelpers.getSecurityCode().then((response) => {
    if (req.body.security_code === "") {
      sess.RESPONSE_FOR_ENTER_OTP = `${messages.Empty_OTP_Is_Response}`;
      res.redirect(`/${variable.admin_router}/verifyOtpForgetPass`);
    } else {
      if (req.body.security_code === response[0].code) {
        sess.Update_Password_Route_Status = true;
        res.redirect(`/${variable.admin_router}/forgotPassword`);
        sess.ELIGIBLE_FOR_SENT_0TP_STATUS = null;
      } else {
        sess.RESPONSE_FOR_ENTER_OTP = `${messages.OTP_Invalid}`;
        res.redirect(`/${variable.admin_router}/verifyOtpForgetPass`);
      }
    }
  })
});

//----------AFTER-OTP-CONFIRM-UPDATE-PASSWORD----------//

//----------GET-UPDATE-PASSWORD----------//
router.get("/forgotPassword", (req, res) => {
  let sess = req.session;
  if (sess.Update_Password_Route_Status) {
    let RESPONSE_FOR_ENTER_PASSWORD = sess.RESPONSE_FOR_ENTER_PASSWORD;
    res.render(`${variable.admin_router}/forgotPassword`, {
      RESPONSE_FOR_ENTER_PASSWORD,
      static: true,
    });
    sess.RESPONSE_FOR_ENTER_PASSWORD = null;
  } else {
    res.redirect(`/${variable.admin_router}/forgot-password`);
  }
});
//----------POST-UPDATE-PASSWORD----------//
router.post("/forgotPassword", (req, res) => {
  let sess = req.session;
  if (req.body.password === "") {
    sess.RESPONSE_FOR_ENTER_PASSWORD = `${messages.Empty_New_Password}`;
    res.redirect(`/${variable.admin_router}/forgotPassword`);
  } else if (req.body.password.length >= 6) {
    if (req.body.password.length <= 16) {

      // 
      let ForgetPassEmail = req.session.USER_ENTER_FOUNDED_EMAIL
      productHelpers.ForgotPassword(req.body, ForgetPassEmail).then((response) => {
        if (response.modifiedCount === 1) {
          sess.Update_Password_Route_Status = null;
          sess.RESPONSE_FOR_FORGOT_PASSWORD = obj = {
            message: `${messages.Password_Reset_Successful}`,
            status: true,
          };
          res.redirect(`/${variable.admin_router}/login`);
        } else {
          sess.RESPONSE_FOR_FORGOT_PASSWORD = obj = {
            message: `${messages.Password_Reset_Failed}`,
            status: false,
          };
          res.redirect(`/${variable.admin_router}/login`);
        }
      });
      // -----
    } else {
      sess.RESPONSE_FOR_ENTER_PASSWORD = `${messages.No_MoreThan_Restricted_Characters}`;
      res.redirect(`/${variable.admin_router}/forgotPassword`);
    }
  } else {
    sess.RESPONSE_FOR_ENTER_PASSWORD = `${messages.Enter_Minimum_Restricted_Characters}`;
    res.redirect(`/${variable.admin_router}/forgotPassword`);
  }
});




router.get("/getUsersTypeAnswer/:id", (req, res) => {
  req.session.RedirectPurposeStoreID = req.params.id
  // let sess = req.session;
  // if (sess.Update_Password_Route_Status) {
  //   let RESPONSE_FOR_ENTER_PASSWORD = sess.RESPONSE_FOR_ENTER_PASSWORD;
  //   res.render(`${variable.admin_router}/forgotPassword`, {
  //     RESPONSE_FOR_ENTER_PASSWORD,
  //     static: true,
  //   });
  //   sess.RESPONSE_FOR_ENTER_PASSWORD = null;
  // } else {
  //   res.redirect(`/${variable.admin_router}/forgot-password`);
  // }
  productHelpers.getTypeAnswer(req.params.id).then((response)=>{
    console.log(response);
    // res.render(`${variable.admin_router}/editQstntype`, {
    //   admin, 
    //   // Data: response,
    //   // response: req.session.MESSAGE
    // });
    res.render(`${variable.admin_router}/viewMore`,{response,admin,
    MESSAGE:req.session.MESSAGE
    })
    req.session.MESSAGE =null
  })
});





router.post("/checkTypeQstnAnswer", (req, res) => {
  console.log(req.body);
  if(req.body.type_question_answer === 'correct'){
    productHelpers.update_Type_Question_Answer(req.body._id).then((response)=>{
            req.session.MESSAGE = {
      message: 'score added',
      status: true,
    }
    console.log(req.session.RedirectPurposeStoreID,'seession id');
      res.redirect(`/${variable.admin_router}/getUsersTypeAnswer/${req.session.RedirectPurposeStoreID}`)
      })
  }else{
    res.redirect(`/${variable.admin_router}/getUsersTypeAnswer/${req.session.RedirectPurposeStoreID}`)
  }
  //   console.log(response);

    
});




module.exports = router;

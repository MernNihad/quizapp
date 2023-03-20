var db = require("../config/connection");
var collection = require("../config/collections");
var bcrypt = require("bcrypt");
var objectId = require("mongodb").ObjectId;
const { response, request } = require("express");
const { PRODUCT_COLLECTION } = require("../config/collections");
module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + ' ' + time;
      let objData = {
        name: userData.name,
        email: userData.email,
        date: dateTime,
        password: userData.password
      }
      db.get().collection(collection.USER_COLLECTION).findOne({ email: objData.email }).then(async (response) => {
        if (response == null) {
          objData.password = await bcrypt.hash(objData.password, 10);
          db.get().collection(collection.USER_COLLECTION).insertOne(objData).then((data) => {
            let proID = data.insertedId;
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(proID) }).then((user) => {
              response = {
                user: user,
                login: true
              }
              resolve(response);
            });
          });
        } else {
          resolve({ login: false })
        }
      })
    });
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            console.log("login successfully (line 29.54)");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("Password wrong (line 34.48)");
            let LoginError = 'Password wrong'
            resolve({ status: false, LoginError });
          }
        });
      } else {
        console.log("Email not found ");
        let EmailError = 'Email not found'
        resolve({ status: false, EmailError });
      }
    });
  },
  AllCatagories: () => {
    return new Promise(async (resolve, reject) => {
      let data = await db.get().collection(collection.CATEGORY_COLLECTION).find().sort({ name: 1 }).collation({ locale: "en", caseLevel: true }).toArray()
      resolve(data)
    })
  },
  getSubCategory: (CateId) => {
    return new Promise(async (resolve, reject) => {
      let result = await db.get().collection(collection.SUBCATEGORY_COLLECTION).find({ category: objectId(CateId) }).toArray()
      resolve(result)
    })
  },
  
}



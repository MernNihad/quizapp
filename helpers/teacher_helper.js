var db = require("../config/connection");
var collection = require("../config/collections");
var bcrypt = require("bcrypt");
var objectId = require("mongodb").ObjectId;
const { response, request } = require("express");
const { PRODUCT_COLLECTION } = require("../config/collections");
const variables = require("../config/variables");
const collections = require("../config/collections");
module.exports = {
    doLogin: (userData) => {
        // console.log('start server');
        return new Promise(async (resolve, reject) => {
          let response = {};
          let user = await db.get().collection(collection.ADMIN_ADD_TEACHER).findOne({ email: userData.email });
          if (user) {
            if(user.password===userData.password){
              console.log('email password correct');
              db.get().collection(collections.ADMIN_ADD_TEACHER).findOne({_id:user._id}).then((data)=>{

                // console.log(user,'user for server side');
                resolve({status:true,data})
              })
            }else{
              console.log('Password not correct');
            let message = 'Password not correct'
            resolve({ status: false, message });
            }
          } 
          else {
            console.log("Email not found ");
            let message = 'Email not found'
            resolve({ status: false, message });
          }
        });
      },







 
  getQuestionForAtten: (CateId,type) => {
    console.log(CateId,type);
    return new Promise(async (resolve, reject) => {
      let result = await db.get().collection(collection.ADMIN_QUESTION_COLLECTION).find({ _category_id: CateId,typeOfQst:type }).toArray()
      resolve(result)
    })
  },
  getQuestionForAttenOne: (CateId) => {
    return new Promise(async (resolve, reject) => {
      let result = await db.get().collection(collection.ADMIN_QUESTION_COLLECTION).findOne({ _id: objectId(CateId) }).then((response)=>{
        resolve(response)
      })
    })
  },

  addAnswerCollectionForUsers: (userID,score,qstn_id,type_answe,answer,typeOfQst) => {
  
    let obj 
      if(type_answe==true){
        obj =
        {
          userID,
          score,
          qstn_id,
          typeOfQst,
          answer,
        }
      }else{
        obj =
        {
          userID,
          score,
          qstn_id,
        }
      }

    return new Promise(async (resolve, reject) => {

            db.get().collection(collection.USER_ANSWER_COLLECTION).findOne({userID:userID,qstn_id:qstn_id}).then((response)=>{
              if(response==null){
                db.get().collection(collection.USER_ANSWER_COLLECTION).insertOne(obj).then((response)=>{
                  resolve({status:true,message:'successfully inserted'})
                })
              }else{
                reject({status:false,message:'error'})
              }  
            })
    })
  },

  
  getScore: () => {
    return new Promise(async (resolve, reject) => {
      // db.dummy.aggregate([{$group: {_id:null, sum_val:{$sum:"$price"}}}])

      let data = await db.get().collection(collection.USER_ANSWER_COLLECTION).aggregate(
        [
          {
            $group: {
              _id:null,
               total_score:{$sum:"$score"}
            }
          }
        ]
        ).toArray()
        // console.log(data);
        resolve(data)
     
    })
  },


  getTecherData: (id) => {
    return new Promise(async (resolve, reject) => { 
      db.get().collection(collection.ADMIN_ADD_TEACHER).findOne({_id:objectId(id)}).then((response)=>{
        console.log(response);
        resolve(response)
      })
    })
  },


  clearScore: (userID) => {
    return new Promise(async (resolve, reject) => {
      let data = await db.get().collection(collection.USER_ANSWER_COLLECTION).deleteMany({userID:userID})
    resolve(true)
    })
  },



  AllCatagories: () => {
    return new Promise(async (resolve, reject) => {
      let data = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
      if(data.length>0){
        resolve({status:true,data})
      }else{
        resolve({status:false})
      }
    })
  },
  getSubCategory: (CateId) => {
    return new Promise(async (resolve, reject) => {
      let result = await db.get().collection(collection).find({ category: objectId(CateId) }).toArray()
      resolve(result)
    })
  },
  
  editProfile: (data,id) => {
    return new Promise(async (resolve, reject) => {
       
        console.log(id);

            db.get().collection(collection.ADMIN_ADD_TEACHER).updateOne({ _id: objectId(id) }, {
                $set: {
                    email: data.email,
                    password: data.password,
                    name: data.name
                }
            }).then((res)=>resolve(true))
            
    })
},
}



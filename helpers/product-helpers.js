var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
var bcrypt = require("bcrypt");
const { Db } = require('mongodb')
const { response } = require('express');
const { reject } = require('bcrypt/promises');
module.exports = {

    AddCategories: async (data, dash, callback) => {
        let result = await db.get().collection(collection.CATEGORY_COLLECTION).findOne({ name: dash })
        if (result == null) {
            let getData
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            let obj = {
                name: dash,
                date: dateTime
            }
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(obj).then((data) => {
                getData =
                {
                    inserted_Id: data.insertedId,
                    status: true
                }
                callback(getData)
            })
        } else {
            getData = {
                message: 'This name is already available',
                status: false
            }
            callback(getData)
        }

    },
    getAllCategories: () => {
        return new Promise(async (resolve, reject) => {
            let categories = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            obj = {
                categories,
                length: categories.length
            }
            resolve(obj)
        })
    },

    getTeacher: () => {
        return new Promise(async (resolve, reject) => {
            let categories = await db.get().collection(collection.ADMIN_ADD_TEACHER).find().toArray()
            if (categories.length > 0) {

                obj = {
                    categories,
                    status: true
                }
                resolve(obj)
            } else {
                obj = {
                    message:'not contents',
                    status: false
                }
                resolve(obj)
            }
        })
    },
    
    getTeacherForEdit: (this_is) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.ADMIN_ADD_TEACHER).findOne({_id:objectId(this_is)}).then((categories)=>resolve(categories))
 
        })
    },
    // --------
    addQuestions: (data) => {
        return new Promise(async (resolve, reject) => {
            // let categories = await
            db.get().collection(collection.ADMIN_QUESTION_COLLECTION).insertOne(data).then((response) => {
                console.log(response);
                if (response.acknowledged) {
                    resolve({ status: true })
                } else {
                    resolve({ status: false })
                }
            })
            // obj = {
            //     categories,
            //     length : categories.length
            // }
            // resolve(obj)
        })
    },
    // ---------

    // --------
    addTeacher: (data) => {
        return new Promise(async (resolve, reject) => {
            // let categories = await
            console.log(data.email);
            db.get().collection(collection.ADMIN_ADD_TEACHER).findOne({ email: data.email }).then((response) => {
                console.log(response);
                if (response==null) {
                    db.get().collection(collection.ADMIN_ADD_TEACHER).insertOne(data).then((response) => {
                        if (response.acknowledged) {
                            resolve({ status: true })
                        } else {
                            resolve({ status: false })
                        }
                    })
                }else
                {
                    resolve({ status: false ,message:'mail is already available'})
                }
            })
            // console.log(result.length);
            // if(result.length>0){
            //     console.log(0 ,'is zero');
            //     console.log(result);

            // }else
            // {
            //     console.log(result);
            //     console.log(0 ,'is low');
            //     resolve({status:false,message:"this mail already available"})
            // }

        })
    },

    // ---------
    deleteCategory: (categoryID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({ _id: objectId(categoryID) }).then((response) => {
                db.get().collection(collection.SUBCATEGORY_COLLECTION).deleteMany({ category: objectId(categoryID) }).then((response) => {
                    resolve(response)
                })
            })
        })
    },

    deleteTeacher: (categoryID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADMIN_ADD_TEACHER).deleteOne({ _id: objectId(categoryID) }).then((response) => {
                resolve(true)
            })
        })
    },

    deleteQuestion: (subcategoryID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADMIN_QUESTION_COLLECTION).deleteOne({ _id: objectId(subcategoryID) }).then((response) => {
                if (response.deletedCount == 1) {
                    resolve({ status: true })
                } else {
                    resolve({ status: false })
                }
            })
        })
    },
    getCategoryDetails: (CategoryID) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).findOne({ _id: objectId(CategoryID) }).then((response) => {
                resolve(response)
            })
        })
    },
    getSecurityCode: () => {
        return new Promise(async(resolve, reject) => {
            let result = await db.get().collection(collection.ADMIN_SECURITY).find().toArray()
            resolve(result)
        })
    },

    // editTeacher: (CategoryID) => {
    //     return new Promise(async(resolve, reject) => {
    //         let obj
    //         db.get().collection(collection.ADMIN_ADD_TEACHER).updateOne({_id:categoryID},{$set:{
    //             name:
    //         }}).then(()=>{

    //         })
    //         if(result){
    //             obj = {
    //                 status:false,
    //                 response:null
    //             }
    //             resolve(obj)
    //         }
    //         var today = new Date();
    //         var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    //         var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //         var dateTime = date + ' ' + time;

    //         db.get().collection(collection.CATEGORY_COLLECTION).updateOne({ _id: objectId(CategoryID) }, {
    //             $set: {
    //                 name: name,
    //                 date:dateTime,
    //             }
    //         }).then((response) => {
    //             obj = {
    //                 status:true,
    //                 response
    //             }
    //             resolve(obj)
    //         })
    //     })
    // },

    // getTeacher: (CategoryID) => {
    //     return new Promise((resolve, reject) => {
    //         db.get().collection(collection.ADMIN_ADD_TEACHER).find().then((response) => resolve(response))
    //     })
    // },
    updateTeacher: (id, data) => {
        return new Promise(async (resolve, reject) => {
            let obj
            db.get().collection(collection.ADMIN_ADD_TEACHER).updateOne({ _id: objectId(id) },{$set:{
                name:data.name,
                email:data.email,
                password:data.password
            }}).then((response)=>{
                if(response.modifiedCount>0){
                    resolve({status:true,message:'successfully updates'})
                }else
                {
                    resolve({status:false,message:'not updated'})
                }
            })
            // if (result) {
            //     obj = {
            //         status: false,
            //         response: null
            //     }
            //     resolve(obj)
            // }
            // var today = new Date();
            // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            // var dateTime = date + ' ' + time;

            // db.get().collection(collection.CATEGORY_COLLECTION).updateOne({ _id: objectId(CategoryID) }, {
            //     $set: {
            //         name: name,
            //         date: dateTime,
            //     }
            // }).then((response) => {
            //     obj = {
            //         status: true,
            //         response
            //     }
            //     resolve(obj)
            // })
        })
    },
    // setSecurityCode
    addSecurityCode: (code) => {
        console.log(code);
        return new Promise(async (resolve, reject) => {
            let obj
            let result =await db.get().collection(collection.ADMIN_SECURITY).find().toArray()
            console.log(result.length);
            if(result.length=== 0){
                db.get().collection(collection.ADMIN_SECURITY).insertOne({ code  : code }).then((res)=>resolve({status:true,message:'Successfully inserted'}))
            }else{
                resolve({status:false,message:"already code available"})
                
            }
        })
    },
    
    updateCategory: (CategoryID, CategoryDetails, name) => {
        return new Promise(async (resolve, reject) => {
            let obj
            let result = await db.get().collection(collection.CATEGORY_COLLECTION).findOne({ name: name })
            if (result) {
                obj = {
                    status: false,
                    response: null
                }
                resolve(obj)
            }
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;

            db.get().collection(collection.CATEGORY_COLLECTION).updateOne({ _id: objectId(CategoryID) }, {
                $set: {
                    name: name,
                    date: dateTime,
                }
            }).then((response) => {
                obj = {
                    status: true,
                    response
                }
                resolve(obj)
            })
        })
    },

    editSecurityCode: (code,id) => {
        console.log(code,id);
        return new Promise(async (resolve, reject) => {
            let obj
            let result = await db.get().collection(collection.ADMIN_SECURITY).updateOne({_id:objectId(id)},{$set:{ code: code }})
            if(result.modifiedCount === 1){
                resolve({status:true,message:'Successfully updated'})
            }else{
                resolve({status:false,message:'failed'})
            }
            // if (result) {
            //     obj = {
            //         status: false,
            //         response: null
            //     }
            //     resolve(obj)
            // }
            // var today = new Date();
            // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            // var dateTime = date + ' ' + time;
            console.log(result);
            // db.get().collection(collection.CATEGORY_COLLECTION).updateOne({ _id: objectId(CategoryID) }, {
            //     $set: {
            //         name: name,
            //         date: dateTime,
            //     }
            // }).then((response) => {
            //     obj = {
            //         status: true,
            //         response
            //     }
            //     resolve(obj)
            // })
        })
    },


    getUserDetails: () => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).find().toArray().then((response) => {
                let obj = {
                    length: response.length,
                    users: response
                }
                resolve(obj)
            })
        })
    },
    addSubcategories: (data, CatID, name) => {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        let obj = {
            name: name,
            link: data.link,
            category: objectId(CatID),
            date: dateTime,
        }
        return new Promise(async (resolve, reject) => {
            let resData
            let result = await db.get().collection(collection.SUBCATEGORY_COLLECTION).findOne({ name: { '$in': [obj.name] }, category: { '$in': [objectId(CatID)] } })
            if (result === null) {
                db.get().collection(collection.SUBCATEGORY_COLLECTION).insertOne(obj).then((data) => {
                    resData = {
                        inserted_Id: data.insertedId,
                        status: true
                    }
                    resolve(resData)
                })
            } else {
                resData = {
                    message: 'The name is already available',
                    status: false
                }
                resolve(resData)
            }

        })
    },
    getQuestions: (CategoryID, Category_Name) => {
        return new Promise(async (resolve, reject) => {
            let response = await db.get().collection(collection.ADMIN_QUESTION_COLLECTION).find({ _category_id: CategoryID, typeOfQst: Category_Name }).toArray()
            let obj
            if (response.length > 0) {
                obj = {
                    response,
                    status: true
                }
                resolve(obj)
            } else {
                obj = {
                    message: 'subcategory is not available',
                    status: false
                }
                resolve(obj)
            }
        })
    },
    getQuestionForUpdate: (Category_UniqueID) => {
        return new Promise(async (resolve, reject) => {
            let obj
            let response = await db.get().collection(collection.ADMIN_QUESTION_COLLECTION).findOne({ _id: objectId(Category_UniqueID) }).then((response) => {
                if (response) {
                    obj = {
                        response,
                        status: true
                    }
                    resolve(obj)
                } else {
                    obj = {
                        message: 'subcategory is not available',
                        status: false
                    }
                    resolve(obj)
                }
            })

        })
    },
    getSubcategory: (id) => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collection.SUBCATEGORY_COLLECTION).findOne({ _id: objectId(id) })
            resolve(result)
        })
    },
    updateSubcategory: (id, data, name, SubCat_ID) => {
        return new Promise(async (resolve, reject) => {
            let obj
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            db.get().collection(collection.SUBCATEGORY_COLLECTION).updateOne({ _id: objectId(id) }, {
                $set: {
                    name: name,
                    link: data.link,
                    date: dateTime,
                }
            }).then((response) => {
                obj = {
                    status: true,
                    response
                }
                resolve(obj)
            })
        })
    },



    updateQuestionForMCQ: (data) => {
        return new Promise(async (resolve, reject) => {
            let obj

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            db.get().collection(collection.ADMIN_QUESTION_COLLECTION).updateOne({ _id: objectId(data.this_id) }, {
                $set: {
                    question: data.question,
                    answer: data.answer
                }
            }).then((response) => {

                if (response.modifiedCount === 1) {
                    obj = {
                        status: true,
                        response
                    }
                    resolve(obj)
                } else {
                    obj = {
                        status: false,
                    }
                    resolve(obj)
                }
            })
        })
    },


    updateQuestionForTOF: (data) => {
        return new Promise(async (resolve, reject) => {
            let obj

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            db.get().collection(collection.ADMIN_QUESTION_COLLECTION).updateOne({ _id: objectId(data.this_id) }, {
                $set: {
                    question: data.question,
                    option_A: data.option_A,
                    option_B: data.option_B,
                    option_C: data.option_C,
                    option_D: data.option_D,
                    answer: data.answer
                }
            }).then((response) => {

                if (response.modifiedCount === 1) {
                    obj = {
                        status: true,
                        response
                    }
                    resolve(obj)
                } else {
                    obj = {
                        status: false,
                    }
                    resolve(obj)
                }
            })
        })
    },


    updateQuestionForTypeQstn: (data) => {
        return new Promise(async (resolve, reject) => {
            let obj

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            db.get().collection(collection.ADMIN_QUESTION_COLLECTION).updateOne({ _id: objectId(data._category_id) }, {
                $set: {
                    question: data.question,
                }
            }).then((response) => {

                if (response.modifiedCount === 1) {
                    obj = {
                        status: true,
                        response
                    }
                    resolve(obj)
                } else {
                    obj = {
                        status: false,
                    }
                    resolve(obj)
                }
            })
        })
    },

    getAdminData: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADMIN_COLLECTION).findOne({ _id: objectId(id) }).then((response) => {
                resolve(response)
            })
        })
    },
    updateProfile: (data, id) => {
        return new Promise(async (resolve, reject) => {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            let object
            if (data.password) {
                let obj = {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    date: dateTime,
                }
                obj.password = await bcrypt.hash(obj.password, 10);
                db.get().collection(collection.ADMIN_COLLECTION).updateOne({ _id: objectId(id) }, {
                    $set: {
                        email: obj.email,
                        password: obj.password,
                        name: obj.name
                    }
                }).then(async (response) => {
                    let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ _id: objectId(id) })
                    admin._id = admin._id.toString()
                    object = {
                        admin,
                        status: true,
                        password: true
                    }
                    resolve(object)
                })
            } else {
                db.get().collection(collection.ADMIN_COLLECTION).updateOne({ _id: objectId(id) }, {
                    $set: {
                        email: data.email,
                        name: data.name
                    }
                }).then(async (response) => {
                    let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ _id: objectId(id) })
                    admin._id = admin._id.toString()
                    object = {
                        admin,
                        status: true,
                        password: false
                    }
                    resolve(object)
                })
            }
        })
    },
    FoundEmail: (data) => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: data.email })
            if (result !== null) {
                resolve({ status: true })
            }
            else {
                resolve({ status: false })
            }
        })
    },
    ForgotPassword: (data, email) => {
        return new Promise(async (resolve, reject) => {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            let obj = {
                password: data.password
            }
            // obj.password = await bcrypt.hash(obj.password, 10);
            db.get().collection(collection.ADMIN_COLLECTION).updateOne({ email: email }, {
                $set: {
                    password: obj.password,
                    date: dateTime,
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },
    doLogin: (userData) => {
        console.log('admin login ', userData);
        return new Promise(async (resolve, reject) => {
            let response = {};
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: userData.email });
            if (admin) {
                if (userData.password === admin.password) {
                    response.admin = admin;
                    response.status = true;
                    resolve(response);
                } else {
                    resolve({ status: false })
                }
            } else {
                resolve({ status: false });
            }
        });
    },
    confirmPass: (EnterPassword, password) => {
        console.log(EnterPassword, password);
        return new Promise(async (resolve, reject) => {
            let response = {};
            if (EnterPassword === password) {
                console.log("login successfully (line 29.54)");
                response.status = true;
                resolve(response);
            } else {
                console.log("login failed (line 34.48)");
                response.status = false;
                response.message = 'Password not matched'
                resolve(response);
            }

        });
    },
    getSubCatAddedOneResult: (id) => {
        return new Promise((resolve, reject) => {
            let result = db.get().collection(collection.SUBCATEGORY_COLLECTION).findOne({ _id: id });
            resolve(result)
        })
    },
    getSubcategories: () => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collection.SUBCATEGORY_COLLECTION).find().toArray()
            obj = {
                length: result.length
            }
            resolve(obj)
        })
    },
    getEmails: () => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collection.USER_COLLECTION).find({}, { email: 1 }).toArray()
            obj = {
                length: result.length
            }
            resolve(obj)
        })
    },
}
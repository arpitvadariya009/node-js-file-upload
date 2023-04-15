const express = require('express');

const port = 9000;

const app = express();

const path = require('path');

const fs = require('fs');

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

const db = require('./config/mongoose');

const AdminModel = require('./models/AdminModel');

app.use(express.urlencoded());

app.get('/',(req,res)=>{
        return res.render('form')
})

const imagePath = path.join("uploads");
app.use("/uploads",express.static(path.join(__dirname,"uploads")));


const multer = require('multer');

const mystorage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,imagePath);  
    },
    filename : (req,file,cb) => {
        cb(null,file.fieldname+"-"+Date.now()); 
    }
})

const imageUpload = multer({ storage : mystorage}).single('avatar');

app.post('/createdata',imageUpload,(req,res)=>{
    AdminModel.create({
        name : req.body.name,
        avatar : imagePath+"/"+req.file.filename
    }).then((data)=>{
        console.log("Record successfully insert");
        return res.redirect('back');
    }).catch((err)=>{
        if(err){
            console.log(err);
            return false;
        }
        
    });
});
app.get('/viewdata',(req,res)=>{
    AdminModel.find({}).then((data)=>{
      return res.render('view',{
        alldata : data
      })
   }).catch((err)=>{
    if(err){
        console.log(err);
        return false
    }
   });
});

app.get('/deletedata/:id', (req, res) => {
    let id = req.params.id;
  
    AdminModel.findById(id).then((data) => {
      fs.unlinkSync(data.avatar);
    });
    AdminModel.findByIdAndDelete(id).then((data)=>{
        console.log("Record successfully delete");
        return res.redirect('back');
    }).catch((err)=>{
        if(err){
            console.log("Record not delete");
            return false;
        }
    })
});

app.get('/editdata/:id',(req,res)=>{
    let id = req.params.id;

    AdminModel.findById(id).then((data)=>{
        return res.render('edit',{
            singlerec : data
        });
    }).catch((err)=>{
        if(err){
            console.log(err);
            return false;
        }
        console.log("data updated");
    });
});

app.post('/updateData',imageUpload,(req,res)=>{
    let id = req.body.id;



    if(req.file){
        AdminModel.findById(id).then((data)=>{
            fs.unlinkSync(data.avatar);
        })

        AdminModel.findByIdAndUpdate(id,{
            name : req.body.name,
            avatar : imagePath +"/"+req.file.filename
        }).then((data)=>{
            console.log("updated");
            return res.redirect('/viewdata');
        }).catch((err)=>{
            if(err){
                console.log(err);
                return false;
            }
        });
    }
    else{
        AdminModel.findById(id).then((data)=>{
            let oldimg = data.avatar;
            AdminModel.findByIdAndUpdate(id,{
                name : req.body.name,
                avatar : oldimg
            }).then((data)=>{
                console.log("updated");
                return res.redirect('/viewdata');
            }).catch((err)=>{
                if(err){
                    console.log(err);
                    return false;
                }
            });
        })
    }

});

app.listen(port,(err)=>{
if(err){
    console.log(err);
    return false;
}
console.log("server start on port 9000");
});
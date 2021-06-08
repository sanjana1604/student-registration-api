const express=require('express');
const router=express.Router();
const Student=require('../models/regis');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {check, validationResult}=require('express-validator');
const {SECRET_KEY}=require('../config/default');

router.get('/',async(req, res, next)=>{
  try{
    const students= await Student.find()
    res.status(200).json(students);
  }
  catch(err){
    res.send('Error'+ err);
  }
});

router.post('/',[
  check('rollNo').trim().not().isEmpty(),
  check('uname').trim().not().isEmpty(),
  check('email','Please enter a valid email.')
    .isEmail()
    .normalizeEmail(),
  check('password','Please enter atleast 5 characters').trim().isLength({min:5}),
  check('mobileNo','Please enter a valid mobile number').isMobilePhone(),
  check('fatherName','Please enter father name').trim().not().isEmpty(),
  check('schoolName','Please enter school name').trim().not().isEmpty(),
  check('course','Please enter course name').trim().not().isEmpty(),
  check('gender','Please enter gender').trim().not().isEmpty(),
  check('dob','Please enter DOB').trim().not().isEmpty()
],async(req, res, next)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({msg:errors.array()});
  }
  const {rollNo,uname,email,fatherName,schoolName,course,specialization,mobileNo,password,dob,createdDate,gender}=req.body;
  let student;
  const findStudent=await Student.findOne({rollNo:rollNo})
  if(findStudent){
    res.status(400).json({msg:[{msg:'Email already exist'}]});
  }
  else{
    student=new Student({
    rollNo:rollNo,
    uname:uname,
    email:email,
    fatherName:fatherName,
    schoolName:schoolName,
    course:course,
    specialization:specialization,
    mobileNo:mobileNo,
    password:password,
    dob:dob,
    createdDate:createdDate,
    gender:gender
  });
  try{
    const salt= await bcrypt.genSalt(10);
    student.password= await bcrypt.hash(password, salt);
    const student1=await student.save();
    const payload={
      student1:{
        id:student1.id
      }
    }
    jwt.sign(payload, SECRET_KEY,{expiresIn:36000},(err, token)=>{
      if(err){
        res.json(err);
      }
      else{
        return res.status(200).json({token,student1, msg:[{msg:'Student Register Successfully'}]});
      }
    });
  }catch(err){
    res.send('Error'+err);
  }
  }
});
router.get('/:id',async(req, res, next)=>{
  try{
    const student= await Student.findById(req.params.id)
    res.json(student);
  }
  catch(err){
    res.send('Error'+ err);
  }
});
router.patch('/:id',async(req, res, next)=>{
  try{
    const id=req.params.id;
    const student= await Student.findById(id);
    if(student){
    const updatedInfo=req.body;
    try{
      const s1=await Student.findByIdAndUpdate(id,updatedInfo);
      res.status(200).json({msg:[{msg:'Student Data updated'}]});
    }catch(err){
      res.send('Error'+err); 
    }
    }
    else{
      res.status(400).json({msg:[{msg:'Student do not exist'}]});
    }
  }catch(err){
    res.send('Error'+err);
  }
});
router.delete('/:id',async(req, res, next)=>{
  const id=req.params.id;
  try{
    const student =await Student.findById(id);
    if(student){
    await Student.deleteOne({_id:id});
    res.status(200).json({msg:[{msg:'Student Data deleted'}]});
    }
    else{
      res.status(400).json({msg:[{msg:'Student do not exist'}]});
    }
  }catch(err){
    res.send('Error'+err);
  }
});
module.exports= router;
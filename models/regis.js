const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const registerSchema=new Schema({
  rollNo: {
    type: Number,
  },
  uname: {
    type: String,
  },
  email: {
    type: String,
  },
  fatherName: {
    type: String,
  },
  schoolName: {
    type: String,
  },
  course: {
    type: String,
  },
  specialization: {
    type: String,
  },
  mobileNo: {
    type: Number,
  },
  password: {
    type: String,
  },
  dob: {
    type: Date,
  },
  createdDate: {
    type: Date,
    default: Date,
  },
  gender: {
    type: String,
  }
});

const Student=mongoose.model('students',registerSchema);
module.exports=Student;
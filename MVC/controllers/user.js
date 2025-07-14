const user=require("../models/user")

async function handleGetAllUsers(req,res) {
  const allDbUsers = await user.find({});
  return res.json(allDbUsers);
}

async function handleGetUserById(req,res){
  const userfound=await user.findById(req.params.id);    // use->findById for get
  if(!user) return res.status(404).json({error:"user not found"})
  return res.json(userfound);
}

async function handleUpdateUserById(req,res){
  await user.findByIdAndUpdate(req.params.id,{lastName:"changed"})       //use->findByIdAndUpdate(id,parameter to change) for patch
  return res.json({status:"success"});
}

async function handleDeleteUserById(req,res){
  await user.findByIdAndDelete(req.params.id)
  return res.json({ status: "success"});
}

async function handleCreateNewUser(req,res){
  const body=req.body;
  if(!body || !body.first_name || !body.last_name || !body.email ||!body.gender || !body.job_title){
    return res.status(400).json({msg:"All fields are required"});
  }
  const result = await user.create({
    firstName:body.first_name,
    lastName:body.last_name,
    email:body.email,
    gender:body.gender,
    jobTitle:body.job_title
  });
  return res.status(201).json({msg:"success",id : result._id});
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser
};
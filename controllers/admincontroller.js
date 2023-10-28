const Group = require('../models/group'); 
const  GroupUser = require('../models/groupuser');
const User = require('../models/user'); 



exports.addUser= async (req, res, next) => {
    try {
        console.log('req.body recvd' , req.body);
        const { groupName, userEmail } = req.body;
        if(groupName == 'Public'){
            console.log('yehh  hhh ')
            return res.status(400).json({ success: false, error: 'You Are Not Allowed To ADD in Public group' });
        }
        const group = await Group.findOne({ where: { name: groupName } });
        const userGroup = await GroupUser.findOne({ where: { userId: req.user.id, groupId: group.id } });
        if (!userGroup || !userGroup.isAdmin) {
            return res.status(403).json({ success: false, error: 'You are  not an admin of the group' });
        }
        const newUser = await User.findOne({ where: { email: userEmail } });
        if (!newUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        let Groupuser = await GroupUser.findOne({ where: { userId: newUser.id, groupId: group.id } });
        if (Groupuser) {
            return res.status(400).json({ success: false, error: 'User is already in the group' });
        }
        await GroupUser.create({ userId: newUser.id, groupId: group.id  , isAdmin : false });
        res.status(200).json({ success: true, message: 'User added  successfully' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};


exports.makeAdmin = async (req, res, next) => {
    try {
        const { groupName, userEmail } = req.body;
        if(groupName == 'Public'){
            console.log('yehh  hhh ')
            return res.status(400).json({ success: false, error: 'This operation Not Allowed  in Public group' });
        }
        const group = await Group.findOne({ where: { name: groupName } });
        const userGroup = await GroupUser.findOne({ where: { userId: req.user.id, groupId: group.id } });
        if (!userGroup || !userGroup.isAdmin) {
            return res.status(403).json({ success: false, error: 'You are  not an admin of the group' });
        }
        const newAdmin = await User.findOne({ where: { email: userEmail } });
        if (!newAdmin) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        let Groupuser = await GroupUser.findOne({ where: { userId: newAdmin.id, groupId: group.id , isAdmin:true } });
        if (Groupuser) {
            return res.status(400).json({ success: false, error: 'User is already Admin of  the group' });
        }
        await GroupUser.update({ isAdmin: true }, { where: { userId: newAdmin.id, groupId: group.id } });
        res.status(200).json({ success: true, message: 'User made admin successfully' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.removeUser= async (req, res, next) => {
    try {
        const { groupName, userEmail } = req.body;
        if(groupName == 'Public'){
            console.log('yehh  hhh ')
            return res.status(400).json({ success: false, error: 'You Are Not Allowed To Remove from Public group' });
        }
        const group = await Group.findOne({ where: { name: groupName } });
        const userGroup = await GroupUser.findOne({ where: { userId: req.user.id, groupId: group.id } });
        if (!userGroup || !userGroup.isAdmin) {
            return res.status(403).json({ success: false, error: 'You are  not an admin of the group' });
        }
        const newUser = await User.findOne({ where: { email: userEmail } });
        if (!newUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        let Groupuser = await GroupUser.findOne({ where: { userId: newUser.id, groupId: group.id } });
        if (!Groupuser) {
            return res.status(400).json({ success: false, error: 'No such user in  group' });
        }
        await Groupuser.destroy();
        res.status(200).json({ success: true, message: 'User removed  successfully' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
const Group = require('../models/group'); 
const  GroupUser = require('../models/groupuser');
const User = require('../models/user'); 

exports.createGroup = async (req, res, next) => {
    try {
        const { groupName } = req.body;
        let group = await Group.findOne({ where: { name: groupName } });
        if (group) {
            return res.status(400).json({ success: false, error: 'Group already exists' });
        }
        group = await Group.create({ name: groupName });
       // await GroupUser.create({ userId: req.user.id, groupId: group.id });
       await GroupUser.create({ userId: req.user.id, groupId: group.id  , isAdmin : true });
        res.status(201).json({ success: true, group });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};


exports.joinGroup = async (req, res, next) => {
    try {
        const { groupName } = req.body;
        let group = await Group.findOne({ where: { name: groupName } });
        if (!group) {
            return res.status(400).json({ success: false, error: 'Group does not exist' });
        }
        let Groupuser = await GroupUser.findOne({ where: { userId: req.user.id, groupId: group.id } });
        if (Groupuser) {
            return res.status(400).json({ success: false, error: 'User is already in the group' });
        }
        await GroupUser.create({ userId: req.user.id, groupId: group.id });
        res.status(201).json({ success: true, message: 'User added to the group' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getUserGroups = async (req, res, next) => {
    try {
        console.log('in control getusergrou')
        const result = await User.findOne({
            where: { id: req.user.id },
            include: [{
                model: Group,
                through: { attributes: [] } 
            }]
        });
        if (!result) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        console.log('usergroup result:>>' , result.dataValues.groups)
        res.status(200).json({ success: true, groups: result.dataValues.groups });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
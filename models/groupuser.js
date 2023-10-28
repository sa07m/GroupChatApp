const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const GroupUser = sequelize.define('groupuser' , {
    id : {type : Sequelize.INTEGER , autoIncrement : true, allowNull:false , primaryKey : true },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

GroupUser.associate = function(models) {
    UserGroup.belongsTo(models.Group, { foreignKey: 'groupId' });
};

module.exports = GroupUser;
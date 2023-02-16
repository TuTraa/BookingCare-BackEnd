"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class doctorinfor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            doctorinfor.belongsTo(models.User, { foreignKey: 'doctorId' })
            doctorinfor.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceTypeData' })
            doctorinfor.belongsTo(models.Allcode, { foreignKey: 'provinceId', targetKey: 'keyMap', as: 'ProvinceTypeData' })
            doctorinfor.belongsTo(models.Allcode, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentTypeData' })
        }
    }

    doctorinfor.init(
        {
            doctorId: DataTypes.INTEGER,
            priceId: DataTypes.STRING,
            provinceId: DataTypes.STRING,
            paymentId: DataTypes.STRING,
            addressClinic: DataTypes.STRING,
            nameClinic: DataTypes.STRING,
            note: DataTypes.INTEGER,
            count: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "doctorinfor",
            freezeTableName: true
        }
    );
    return doctorinfor;
};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FavoriteSchema = new Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    dishes:[{type:mongoose.Schema.Types.ObjectId,
        ref:'Dish',
        require:true,
        unique: true}]
},{
    timestamps:true
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
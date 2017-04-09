/**
 * test db
 * Created by Ellery on 2017/4/8.
 */

const PetModel = require('./models/pet');


var now = Date.now();
(async () => {
    var dog = await PetModel.create({
        id: 'd-' + now,
        name: 'Gaffey',
        gender: false,
        birth: '2008-08-08',
        createdAt: now,
        updatedAt: now,
        version: 0
    });
    console.log('created: ' + JSON.stringify(dog));
})();
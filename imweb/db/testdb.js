/**
 * test db
 * Created by Ellery on 2017/4/8.
 */

const UserModel = require('../models/users');

(async () => {
    var ellery = await UserModel.create({
        username: 'Ellery',
        nickrname: 'Ellery',
        password: '123',
        salt: '124556',
        gender: 0,
        avatar: 'avatar.jpg',
        autograph: 'hello world.',
    });
    console.log('created: ' + JSON.stringify(ellery));
})();
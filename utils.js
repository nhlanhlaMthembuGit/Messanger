const axios = require('axios');

function addUserDetails(user) {
    /*
    Add a newly registered user to the firebase DB. 
    */

    let user_ID = {

        msidn: user.id,
        telegram_id: user.first_name,
        last_name: user.last_name
    }
    console.log(user_ID);
    console.log('added')
    /*
        Posting data to the processor endpoint
    */
    axios.post('https://processor-module.firebaseapp.com/processor/v1/saveUserDetails/', user_ID)
        .then(function (response) {
            console.log(response.data);
        })

}

function addUserIntent(convo, chat) {

    chat.getUserProfile().then((user) => {

        let userIntent = {

            intent: convo.get('intent'),
            msidn: user.id
            //telegram_id: user.id


        }

        axios.post('https://processor-module.firebaseapp.com/processor/v1/saveuserIntents', userIntent)
            .then(function (response) {
                console.log(response.data);

            })

    })

}

module.exports = {
    addUserDetails: addUserDetails,
    addUserIntent: addUserIntent,

}

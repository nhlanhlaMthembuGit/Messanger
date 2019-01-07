'use strict';
const axios = require('axios')



module.exports = (bot) => {
    //MTN MENU
bot.on('postback:MTNMENU', (payload, chat) => {
    let startingMenu = {
        STRING : '*121#',
        MSIDN : ctx.session.contact_number,
        PDU : 'PSSRR'

    }
        axios.post('http://da41ddb1.ngrok.io/processor/v1/actionRequest' ,startingMenu)
        .then((Response) => {
           console.log(Response.data)
           chat.say(Response.data.STRING)
        })

});
bot.on('message', (payload, chat) =>{
    const text = payload.message.text;
    console.log(`user inputed`);

    let userRequest = {
    STRING : ctx.message.text,
    MSIDN: ctx.session.contact_number,
    PDU: 'USSRC'
}
axios.post('http://da41ddb1.ngrok.io/processor/v1/actionRequest' ,userRequest)
.then((response) =>{
    chat.say(response.data.STRING)
})

})}


 

    


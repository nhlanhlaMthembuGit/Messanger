'use strict';
const BootBot = require('bootbot');
const axios = require('axios');

const bot = new BootBot({
    accessToken: 'EAAdm55t1bJ0BAONZCdiMwKG8bxhonyRY5DZAfMWbgbeJTEnuZBZBd23QlzPj2WjiDMMUl7U00jB8TiUNcLGAuvWxGAbnIYuci7ghrPOEjXVwsXq2xioIVl9DG03aNk7aCOKmBzvyMoGeQkdCZBvXyn2WMLVQ7fuNZCYWhUo3IgIQZDZD',
    verifyToken: 'mtn-ai-bot',
    appSecret: '247f6ff7cc7e090801d96ee74c812217'
});

bot.hear([/hello( there)?/i, /hey( there)?/i, /hi( there)?/i], (payload, chat) => {
    chat.getUserProfile().then((user) => {
        const text = payload.message.text;
        console.log(user.id)
        chat.say(`Y'ello, ${user.first_name}! `, { typing: true }).then(() => {
            const askIntent = (convo => {
                convo.ask(`What would you like to do?`, (payload, convo) => {
                    const text = payload.message.text;
                    convo.set('intent', text)
                    convo.say('Processing...').then(() => {
                        let startingMenu = {
                            STRING: '*121#',
                            MSISDN: ctx.session.contact_number,
                            PDU: 'PSSRR'
                        }
                        axios.post('http://2828f6eb.ngrok.io/processor/v1/actionRequest', startingMenu)
                            .then((Response) => {
                                console.log(Response.data)
                                chat.say(Response.data.STRING)
                            })

                    });
                    bot.on('message', (payload, chat) => {
                        chat.conversation((convo) => {
                            const text = payload.message.text;
                            console.log(`user inputed`);

                            let userRequest = {
                                STRING: `${text}`,
                                MSIDN: convo.get('phone number'),
                                PDU: 'USSRC'
                            }
                            axios.post('http://2828f6eb.ngrok.io/processor/v1/actionRequest', userRequest)
                                .then((response) => {
                                    chat.say(response.data.STRING)
                                })

                        })

                    })
                })


            })

            chat.conversation((convo) => {
                askIntent(convo);
                console.log('user details added...')
            });

        })
    })

})
bot.start();
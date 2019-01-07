'use strict';
const BootBot = require('bootbot');
const axios = require('axios');
const engineModule = require('./modules/engine');

const bot = new BootBot({
  accessToken: 'EAAdm55t1bJ0BAAB1fF90afkAbuAXx4uckbGtkoZATWXddQTQgciCJWNTZChdjNjLEslfkg9e2DTWL7IideNDUZCEY0vHZCxKYKmcbYtTmwWnpd2hZBAag79AaNs4yqyRoy2pIxLQvaQFHc6kknW3nFv1EvkDKC45rE66nJ1nc9PiPG5nb4ZCK1',
  verifyToken: 'mtn-ai-bot',
  appSecret: '247f6ff7cc7e090801d96ee74c812217'
});




//default menu

bot.hear('menu', (payload, chat) => {
	chat.getUserProfile().then((user) => {
		const text = payload.message.text;
		const buttons = [
			{ type: 'postback', title: 'Mtn Menu', payload: 'MTNMENU' },
			{ type: 'postback', title: 'History', payload: 'HISTORY' },
			{ type: 'postback', title: 'Exit', payload: 'EXIT' }
		];
		chat.sendButtonTemplate(`Y'ello ${user.first_name}!, How can i help you?`, buttons);
	});
});


//HISTORY 
bot.on('postback:HISTORY', (payload, chat) => {
	chat.getUserProfile().then((user) => {
		axios.get('https://processor-module.firebaseapp.com/processor/v1/userIntents/' + user.id)
			.then(response => {
				console.log(response.data);

				for (var i = 0; i < response.data.intents.length; i++) {
					console.log(i + ' ' + response.data.intents[i]);

					user.id = response.data.msidn
					chat.say(i + ' - ' + response.data.intents[i]);

					console.log(i + ' ) ' + response.data.intents[i]);

					console.log(response.data.intents)
				}



			})

		chat.say(`To go to the Main menu just enter “menu.”`);



	})

})

//EXIT
bot.on('postback:EXIT', (payload, chat) => {
	chat.getUserProfile().then((user) => {
		chat.say(`Bye ${user.first_name}! come back soon. \nTo go to the main menu just enter “menu.”`);
	});
});



//BOT START FUNCTION ( CHECK IF USER EXIST OR NOT )

bot.hear([/hello( there)?/i, /hey( there)?/i, /hi( there)?/i], (payload, chat) => {
	chat.getUserProfile().then((user) => {
		const text = payload.message.text;
		console.log(user.id)
		chat.say(`Y'ello, ${user.first_name}! `, { typing: true }).then(() => {
			axios.get('https://processor-module.firebaseapp.com/processor/v1/userDetails/' + user.first_name)
				.then(response => {
					if (response.data.exists === true) {
						console.log("[+] The user exists, routing to the default menu.");
						console.log(response.data.msidn)
						user.id = response.data.msidn
						const text = payload.message.text;
						const buttons = [
							{ type: 'postback', title: 'promos', payload: 'PROMOS' },
							{ type: 'postback', title: 'History', payload: 'HISTORY' },
							{ type: 'postback', title: 'Exit', payload: 'EXIT' }
						];
						chat.sendButtonTemplate(`Y'ello ${user.first_name}!, How can i help you?`, buttons);

						//PROMOS
						bot.on('postback:PROMOS', (payload, chat) => {
							chat.say(`Did you know?`);
							axios.get('https://processor-module.firebaseapp.com/processor/v1/promotions')
								.then(response => {
									chat.say(response.data.advert);

								});
						});

						//HISTORY 
						bot.on('postback:HISTORY', (payload, chat) => {
							chat.getUserProfile().then((user) => {
								axios.get('https://processor-module.firebaseapp.com/processor/v1/userIntents/' + user.id)
									.then(response => {
										console.log(response.data);

										for (var i = 0; i < response.data.intents.length; i++) {
											console.log(i + ' ' + response.data.intents[i]);

											user.id = response.data.msidn
											chat.say(i + ' - ' + response.data.intents[i]);

											console.log(i + ' ) ' + response.data.intents[i]);

											console.log(response.data.intents)
										}



									})

								chat.say(`To go to the Main menu just enter “menu.”`);



							})

						})




						//EXIT
						bot.on('postback:EXIT', (payload, chat) => {
							chat.getUserProfile().then((user) => {
								chat.say(`Bye ${user.first_name}! come back soon. \nTo go to the main menu just enter “menu.”`);
							});
						});


					}
					else {
						console.log("[-] The user does not exist, routing to the registration scene.")
						addUser.addUserDetails(user)
						chat.say(`i see you are new :  ${user.first_name}!`).then(() => {
							const askNumber = (convo => {
								convo.ask(`May you please type in your Phone number for registration?`, (payload, convo) => {
									const text = payload.message.text;
									convo.set('phone number', text);
									convo.say('Thanks got it!').then(() => {
										convo.ask({
											text: `Is this your number: ${text}?`,
											quickReplies: ['Yes', 'No']
										}, (payload, convo) => {
											const text = payload.message.text;
											convo.say(`Thanks for confirming..`);
											convo.end();
										}, [
												{
													event: 'quick_reply',
													callback: (payload, convo) => {
														const text = payload.message.text;
														convo.say(`Coolio, your number has been saved.`).then(() => askIntent(convo));
				
													}
												}
											]);
									});
								});
							});

							const askIntent = (convo => {
								convo.ask(`What would you like to do?`, (payload, convo) => {
									const text = payload.message.text;
									convo.set('intent', text)
									convo.say('Processing...').then(() => {
										convo.ask({
											text: `You sure you want to purchase "${convo.get('intent')}" ?`,
											quickReplies: ['Yup', 'Nop']
										}, (payload, convo) => {
											const text = payload.message.text;
											convo.say(`Thanks for confirming..`);
											convo.end();
										}, [
												{
													event: 'quick_reply',
													callback: (payload, convo) => {
														const text = payload.message.text;
														addIntent.addUserIntent(convo, chat)
														console.log('user intent saved..')
														convo.say(`Sharp, your request has been processed \nTo go main menu just enter “menu.”`)
														convo.end();
				
													}
												}
											])
									});
				
				
								});
							});



							chat.conversation((convo) => {
								askNumber(convo);
								console.log('user details added...')
							});

						})
					}

				});


		});

	})
})
bot.module(engineModule);
// module.exports = engine;
bot.start();
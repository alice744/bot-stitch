module.exports = {
    buttonOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Press', callback_data: '1' }, { text: 'Press', callback_data: '2' }, { text: 'Press', callback_data: '3' }],
                [{ text: 'Press', callback_data: '4' }, { text: 'Press', callback_data: '5' }, { text: 'Press', callback_data: '6' }],
                [{ text: 'Press', callback_data: '7' }, { text: 'Press', callback_data: '8' }, { text: 'Press', callback_data: '9' }]
            ]
        })
    },
    againButtonOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Again', callback_data: '/again' }],
            ]
        })
    }
}
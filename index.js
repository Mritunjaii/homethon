const express=require('express');
const qrcode = require('qrcode-terminal');
const app=express();
const axios = require('axios');
require('dotenv').config();

const port=process.env.PORT;


const { Client,LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});


client.on('message',async (msg) => {
    
    console.log(msg);
    console.log('Message received:', msg);

    try {
        const response = await axios.post('https://n8n.brahmaastra.ai/webhook/03087def-ea2e-443c-8bf4-4921eb6ec5a4', {
            from: msg.from,
            to: msg.to,
            body: msg.body,
            type: msg.type,
            timestamp: msg.timestamp,
            id: msg.id.id
        });
        console.log(' n8n response:', response.data);
        console.log(' Sent to n8n webhook');
    } catch (error) {
        console.error(' Failed to send to n8n:', error.message);
    }

});

client.initialize();



app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
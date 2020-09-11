const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var base64 = require('js-base64').Base64;
const cheerio = require('cheerio');
var open = require('open');
var Mailparser = require('mailparser').MailParser;
const { parse } = require('node-html-parser');
const image=require('./processImage');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// // Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Gmail API.
//   // console.log(JSON.parse(content));
//   authorize(JSON.parse(content), listLabels);
// });

const gettokenurl= async ()=>{
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    // console.log(JSON.parse(content));
    authorize(JSON.parse(content), checkForMediumMails);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const  authorize= async (credentials, callback) =>{
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, async (err, token) => {
    if (err) return await getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getNewToken= async (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const  listLabels=(auth) =>{
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      // console.log('Labels:');
      // checkForMediumMails(auth);
      labels.forEach((label) => {
        // console.log(label);
      });
    } else {
      console.log('No labels found.');
    }
  });

}

const getmessageList=(auth)=>{
    // console.log(auth);

   const gmail = google.gmail({version: 'v1', auth});
   const me = 'giftogomr@gmail.com';
   gmail.users.messages.list({
        userId: me
    }, (err, res) => {
        if(!err){
            // console.log(res.data);
        }
        else{
            console.log(err);
        }
    })
}

const checkForMediumMails=(auth)=>{
    var query = "from:malikshehzad137@gmail.com is:unread";
    const gmail = google.gmail({version: 'v1', auth});
    const me = 'giftogomr@gmail.com';
    gmail.users.messages.list({
        userId: me,
        q: query 
    }, (err, res) => {
        if(!err){

            //mail array stores the mails.
            var mails = res.data.messages;

            //We call the getMail function passing the id of first mail as parameter.
            if(mails){
              mails.forEach(function (res,index){
                console.log(res);
                getMail(res.id , auth);
              })
              
            }
           
            // console.log(res.data);
        }
        else{
            console.log(err);
        }
    });        
}

const getMail=(msgId,auth)=>{
        
    //This api call will fetch the mailbody.
    const gmail = google.gmail({version: 'v1', auth});
    const me = 'giftogomr@gmail.com';
    gmail.users.messages.get({
        'userId': me,
        'id': msgId
    }, (err, res) => {
        if(!err){
            // console.log(res.data);
            var parts=res.data.payload.parts;
            // console.log(res.data.payload.parts[1].body);
            var body = res.data.payload.parts[1].body.data;
            // console.log(body);
            if(body){
              var htmlBody = base64.decode(body.replace(/-/g, '+').replace(/_/g, '/'));
              const root = parse(htmlBody);
              // console.log(root.childNodes[0].childNodes[3]);
              root.childNodes[0].childNodes.forEach(function(res,index){
                if(res.tagName){
                  if(res.tagName==='img'){
                    const reqimage=res;
                    // console.log(reqimage.getAttribute('src'));
                    image.processImage(reqimage.getAttribute('src'));
                  }
                }
                
            
              })
            }
            else{
              // console.log("am here");
              parts.forEach(function (res,index){
                
                if(res.body.attachmentId){
                  console.log(res.body.attachmentId);

                  gmail.users.messages.attachments.get({
                      'userId': me,
                      'messageId':msgId,
                      'id': res.body.attachmentId
                  }, (err, res) => {
                      if(!err){

                        console.log(res);

                  }});

                }
              })


            }
            
           
        }
    });
}

const emailscraper=()=>{
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    
    console.log("running a task on"+hours+minutes+seconds);
    
}

const consoleauth=()=>{
  console.log(auth);
}

module.exports = {
    emailscraper,
    getMail,
    getmessageList,
    checkForMediumMails,
    authorize,
    getNewToken,
    listLabels,
    consoleauth,
    gettokenurl
};

  
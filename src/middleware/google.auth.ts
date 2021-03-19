const {OAuth2Client} = require('google-auth-library');

export class GoogleAuthentication {
    private client;
    constructor(){
        this.client = new OAuth2Client(process.env.CLIENT_ID);
    }
    async verify(idToken: string){
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        return{
            payload,
            userid
        }
    }
}
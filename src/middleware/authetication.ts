import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { GoogleAuthentication } from './google.auth';
const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZhOGJhNTY1MmE3MDQ0MTIxZDRmZWRhYzhmMTRkMTRjNTRlNDg5NWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJzdWIiOiIxMDc3MDkzMjc3MzgxMzYwMzI1MTIiLCJlbWFpbCI6Im5pZWJsZXMucmV5ZXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF1ZCI6IjEwNTM2ODU0NjM2NS0zaHFtM3JrbWlhaWl0anE1YTI5bWxwbjkzcmRla29pMi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF0X2hhc2giOiJNeHVuUW9jalJoT1N0TXRFVElaWHFRIiwibmFtZSI6IkNhbWlsYSBOaWVibGVzUiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaWtpOHl4TkhrdDE2UnRkTXN1QXpwZ2dDZ0lpY2g5c283MFVjeW89czk2LWMiLCJnaXZlbl9uYW1lIjoiQ2FtaWxhIiwiZmFtaWx5X25hbWUiOiJOaWVibGVzUiIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjE2MTEyOTQ2LCJleHAiOjE2MTYxMTY1NDZ9.L73ZEsaX0nbHzZELjyFU5Yua3jm2NimYT5h8u1xjZaqXaajXzNZNm2D5ebofY6iwPszSwSIe4V524AwZ4quzQML5GqC6so2ruFZczMihr3H1YkdGEqU4n0HL4QQm0xNwMF9euw6WXjODT4JX2WkpQmNoJTmCMaOCzjPSrqM5x5r8c45t1vEWfiCXxIuONg_PNxYL51WTTeS_RVBiBY-NN9csRZ2nPgnt7_N9LqJo9e5ym3E06l5DogHpCaS1Gqc6PN85POZrB0Xyi6R7AsKuaia3Ct_Yjh-jBHuy8t8dbnIEFgt4ephTonXZwG4VN6-WZZ9Ypg7YZna7GCaO0czajA'

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware{
    async use(req: Request, res: Response, next: NextFunction) {
        console.log('Request...');
        const googleAuthentication = new GoogleAuthentication();
        try {
            const credentials = await googleAuthentication.verify(idToken);
            console.log(credentials);
            next();
        } catch (error) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
      }
}
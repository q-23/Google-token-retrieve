const request = require('supertest');
const app = require('./app');
const { client_id, client_secret, grant_type, refresh_token } = require('./secrets')
describe('[APP] - ', () => {
    test('Should reject requests without all needed data', async () => {
        try {
            await request(app)
                .get('/')
                .expect(400);
        } catch (e) {
            console.log(e)
        }
    });

    test('Should inform about empty query string variables', async () => {
        try {
            const response = await request(app)
                .get('/')
                .query({ client_id: 'asdas123', grant_type: 'refresh_token', client_secret: 'clasdas' })
                .expect(400);

            expect(response.body.error).toBe('The following variables are missing: refresh_token')
        } catch (e) {
            console.log(e)
        }
    });

    test('Should handle errors regarding incorrect data', async () => {
        try {
            await request(app)
                .get('/')
                .query({ client_id: 'asdas123', grant_type: 'refresh_token', client_secret: 'clasdas', refresh_token: 'dsfdfgfs' })
                .expect(500);
        } catch (e) {
            console.log(e)
        }
    });

    test('Should send access token when all neccessary data is provided', async () => {
        const response = await request(app)
            .get('/')
            .query({ client_id, client_secret, grant_type, refresh_token })
            .expect(200);

        expect(response.body.access_token.length).toBe(170);
    })
})
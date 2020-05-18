const express = require('express');
const request = require('request-promise');
const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    const { client_id, client_secret, grant_type, refresh_token } = req.query;
    const queryVariablesObject = {client_id, client_secret, grant_type, refresh_token}
    
    const allVariablesAreProvided = [client_id, client_secret, grant_type, refresh_token].every(e => !!e);

    try {
        if(!allVariablesAreProvided) {
            const emptyVariables = Object.entries(queryVariablesObject).filter(el => !el[1]).map(e => e[0]);
            return res.status(400).send({error: `The following variables are missing: ${emptyVariables.join(', ')}`})
        }

        const googleApiResponse = await request(`https://oauth2.googleapis.com/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=${grant_type}&refresh_token=${refresh_token}`, {
            method: 'POST'
        });

        const { access_token } = JSON.parse(googleApiResponse);
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).send({access_token});
    } catch(e) {
        res.status(e.status_code || 500).send(e.error || {error: 'Internal server error.'})
    }
});

module.exports = app;

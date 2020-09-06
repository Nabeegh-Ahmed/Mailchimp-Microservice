const router = require('express').Router();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require('md5');

router.get('/:client_info', async (req, res) => {
    req.session.address = req.connection.remoteAddress;
    try {
        JSON.parse(req.params.client_info);
        if(!JSON.parse(req.params.client_info).API_KEY || !JSON.parse(req.params.client_info).PREFIX){
            res.sendStatus(403);
        }
        mailchimp.setConfig({
            apiKey: JSON.parse(req.params.client_info).API_KEY,
            server: JSON.parse(req.params.client_info).PREFIX
        });
        const response = await mailchimp.ping.get();
    } catch (error) {
        req.session.destroy((error) => {
            if(error) res.send(error);
            else {
                res.sendStatus(403);
            }
        })
        
    }
    if(req.session) {
        res.sendStatus(200);
    }
})

router.get('/session', (req, res) => {
    if(req.session) {
        res.send("SESSION_ACTIVE");
    }
    res.send("SESSION_NOT_ACTIVE");
})

router.get('/sessionEnd', (req, res) => {
    req.session.destroy((error) => {
        if(error) res.send(error);
        else res.send("SESSION_ENDED");
    })
})

function validateEmail (email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

router.post('/:user_info', async (req, res) => {
    if(req.session) {
        try {
            const _data = JSON.parse(req.params.user_info); 
            if(!_data.firstName || !_data.lastName || !_data.email || !_data.listID) {
                res.send("INVALID_DATA");    
                res.redirect()
            }
            if(!validateEmail(_data.email)) {
                res.send("INVALID_EMAIL");
                res.redirect()
            }
        } catch(error) {
            res.send("INVALID_DATA");
            res.redirect()
        }
        const data = JSON.parse(req.params.user_info); 
        let email_hash = md5(data.email.toLowerCase());
        try {
            const response = await mailchimp.lists.getListMember(
                data.listID,
                email_hash
            );
            res.send("USER_ALREADY_EXISTS");
            res.redirect()
        } catch (error) {
            if (error.status === 404) {
                try {
                    const response = await mailchimp.lists.addListMember(data.listID, {
                        email_address: data.email,
                        status: "subscribed",
                        merge_fields: {
                            FIRST_NAME: data.firstName,
                            LAST_NAME: data.lastName
                        }
                    });
                } catch (error) {
                    res.send(error.message);
                    res.redirect()
                    // redirect with error message
                }
                res.send("USER_ADDED");
                res.redirect()
            }
        }
    } else {
        res.send("SESSION_NOT_ACTIVATED");
        res.redirect()
    }
})

module.exports = router;
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

const URI = 'mongodb://localhost:27017/soc_lite';

app.use(express.json());

let db;

function isCleanString(val){
    if(typeof val !== 'string') return false;
    if(val.trim().length === 0) return false;
    if(val.length > 100) return false;
    return true;
}

function isValidIPv4(ip){
    if(typeof ip !== 'string') return false;

    return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip)
        && ip.split('.').every(x => Number(x) <= 255);
}

const ALLOWED_STATUSES = [
    'open',
    'closed',
    'investigating'
];

MongoClient.connect(URI)
.then(client => {

    db = client.db('soc_lite');

    console.log('[OK] Connecté à MongoDB');

    app.listen(PORT,()=>{
        console.log(`[OK] API sécurisée sur :${PORT}`);
    });

})
.catch(err=>{
    console.error(err);
    process.exit(1);
});

app.post('/logs/search', async(req,res)=>{

    const safeFilter = {};

    if(req.body.src_ip !== undefined){

        if(!isValidIPv4(req.body.src_ip)){
            return res.status(400).json({
                error:'src_ip invalide'
            });
        }

        safeFilter.src_ip = req.body.src_ip;
    }

    if(req.body.action !== undefined){

        if(!isCleanString(req.body.action)){
            return res.status(400).json({
                error:'action invalide'
            });
        }

        safeFilter.action = req.body.action;
    }

    if(req.body.status !== undefined){

        if(!ALLOWED_STATUSES.includes(req.body.status)){
            return res.status(400).json({
                error:'status non autorisé'
            });
        }

        safeFilter.status = req.body.status;
    }

    try{

        const results = await db.collection('security_logs')
            .find(safeFilter)
            .project({
                _id:0,
                ts:1,
                src_ip:1,
                action:1,
                status:1
            })
            .limit(20)
            .toArray();

        res.json({
            count:results.length,
            data:results
        });

    }catch(err){

        res.status(500).json({
            error:'Erreur serveur'
        });

    }
});

app.post('/auth/login', async(req,res)=>{

    if(
        typeof req.body.username !== 'string' ||
        typeof req.body.password !== 'string'
    ){
        return res.status(400).json({
            error:'username et password doivent être des chaînes'
        });
    }

    const username = req.body.username.trim();
    const password = req.body.password;

    try{

        const user = await db.collection('users').findOne(
            {username},
            {
                projection:{
                    _id:0,
                    username:1,
                    password:1,
                    role:1
                }
            }
        );

        if(!user || user.password !== password){

            return res.status(401).json({
                success:false,
                message:'Identifiants incorrects'
            });

        }

        res.json({
            success:true,
            message:`Bienvenue ${user.username}`,
            role:user.role
        });

    }catch(err){

        res.status(500).json({
            error:'Erreur serveur'
        });

    }
});

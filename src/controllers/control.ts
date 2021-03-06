const config = require('../config');

import Joi from '@hapi/joi';
import { RequestHandler } from "express";
import { pick } from 'lodash';

import { dControl, getControls, getSubControls } from "../models/control";
import { formatSql } from '../utils'


type fetchedControl = dControl[] | null;
type params = { menuParams: string }

const fetchControl: RequestHandler<params> = async (req, res) => {
    const { error } = validate(req.params);
    if(error) return res.status(400).send(error.details[0].message);

    //* Prev State =>  let MenuParams: string = req.params.menuParams + req.body.tabParams;+
    let MenuParams: string = req.params.menuParams;

    console.log('')
    console.log('===============================================================================================================');
    console.log('Control SQL => ' + MenuParams);

    if(req.body.tabParams){
        MenuParams = req.params.menuParams + req.body.tabParams
    }

    let data: fetchedControl = await getControls(config.user.CLIENT_CODE, config.user.MODULE_CODE, MenuParams);
    if (data) {
        const controls = await data.map(async(dt) => {
            dt.ControlName ? dt.ControlName = dt.ControlName.trim() : null;
            if (dt.ControlName && dt.ControlSQL) {
                const placeholders = pick(dt, ['ClientCode', 'ModuleCode', 'GCode', 'GLevel', 'AType', 'ADType', 'TType', 'TDType', 'VDType', 'VType', 'ACode', 'UIType', 'ALevel', 'PCode', 'LCode' ])

                //Mutating the value of ControlSQL after replacing its Placeholder property
                let sql = formatSql(dt.ControlSQL, placeholders);
                dt.ControlSQL = sql;

                // const records = await getSubControls(dt.ControlName, dt.ControlSQL, placeholders)
                const records = await getSubControls(dt.ControlName, sql, placeholders)
                if(records){
                    dt.ControlSQL = records[0];
                    dt.Params = records[1]
                }
            }
            return dt;
        });
        data = await Promise.all(controls);
        console.log('')
        console.log('===============================================================================================================');
        console.log('')
        console.log('')
        console.log('')    
        res.status(200).json(data);
    } 
    else {
        console.log("Cant retrieve data of Menuparams: " + req.params.menuParams)
        console.log('===============================================================================================================');
        console.log('')
        console.log('')
        console.log('')    
        
        res.status(404).send("Cant retrieve data of Menuparams: " + req.params.menuParams);
    }
};

function validate(input: object) {
    const schema = Joi.object({
        menuParams: Joi.string().min(2).pattern(/^[aA-zZ]+$/).required()
    })
    return schema.validate(input)
}

export { fetchControl };

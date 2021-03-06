import Joi from '@hapi/joi';
import { RequestHandler } from "express";
import { pick } from 'lodash';

import { dControl, getControls, getSubControls } from "../models/control";

type fetchedControl = dControl[] | null;
type params = { menuParams: string }

const postForm: RequestHandler<params> = async (req, res) => {
    console.log(req.body)
    // // const { error } = validate(req.params);
    // // if(error) return res.status(400).send(error.details[0].message);

    // // let data: fetchedControl = await getControls('0010', '0100', req.params.menuParams);

    // // if (data) {
    // //     const controls = await data.map(async(dt) => {
    // //         if (dt.ControlSQL) {
    // //             const placeholders = pick(dt, ['ClientCode', 'ModuleCode', 'GCode', 'GLevel', 'AType', 'ADType', 'TType', 'TDType', 'VDType', 'VType', 'ACode', 'UIType', 'ALevel', 'PCode', 'LCode' ])

    // //             const records = await getSubControls(dt.ControlSQL, placeholders)
    // //             if(records){
    // //                 dt.ControlSQL = records[0];
    // //                 dt.Params = records[1]
    // //             }
    // //         }
    // //         return dt;
    // //     });
    // //     data = await Promise.all(controls);
    // //     res.status(200).json(data);
    // } 
    // else {
    //     res.status(404).send("Cant retrieve data");
    // }
};

function validate(input: object) {
    const schema = Joi.object({
        menuParams: Joi.string().min(3).pattern(/^[aA-zZ]+$/).required()
    })
    return schema.validate(input)
}

export { postForm };

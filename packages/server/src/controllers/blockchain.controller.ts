import { Request, Response } from 'express';
import { identity_config, updateSecurityConfig } from '../config';
// import { createAdapter, backends, initServerIdentity, checkCryptographicMaterials } from '../convector';
import { ClientFactory } from '@worldsibu/convector-core';

// export function PersonController_login_post(req: Request, res: Response) {
//     let curUser = null;
//     if (isUser1(req)) {
//         curUser = user1;
//     } else if (isUser2(req)) {
//         curUser = user2;
//     }
//     if (curUser != null) {
//         identity_config.identityName = curUser.identityName;
//         identity_config.identityOrg = curUser.identityOrg;
//         updateSecurityConfig();

//         backends.adapter = createAdapter();
//         backends.initAdapter = backends.adapter.init();
//         backends.PersonControllerBackEnd = ClientFactory(PersonController, backends.adapter);

//         // optional
//         initServerIdentity().then(() => {
//             checkCryptographicMaterials().then(() => {
//                 res.send(JSON.stringify(curUser.username + " successfully logged"));
//             });
//         });
//     } else {
//         res.send(JSON.stringify("user credentials are invalid"));
//     }
// }

// function isUser1(req: Request) {
//     return req.body.username == "Ravindu" && req.body.password == "Ravindu96";
// }

// function isUser2(req: Request) {
//     return req.body.username == "Sachintha" && req.body.password == "Sachintha96";
// }

// export async function PersonController_register_post(req: Request, res: Response): Promise<void> {
//     try {
//         // let params = req.body;
//         // res.status(200).send(await backends.PersonControllerBackEnd
//         //     .register(params.person));
//         createNewUser(req.body.userID, req.body.username);

//     } catch (ex) {
//         console.log('Error post PersonController_register', ex.stack);
//         res.status(500).send(ex);
//     }
// }

// export async function PersonController_get_get(req: Request, res: Response): Promise<void> {
//     try {
//         let params = req.params;
//         res.status(200).send(await backends.PersonControllerBackEnd
//             .get(params.id));

//     } catch (ex) {
//         console.log('Error get PersonController_get', ex.stack);
//         res.status(500).send(ex);
//     }
// }
import { identity_config } from '../config';

export function checkBodyParams(params: any) {
    let isValid: boolean = true;
    params.forEach(param => {
        if(param == null || param == undefined) {
            isValid = false;
        }
    });
    // return isValid;
    if(!isValid) {
        throw new Error('Mandotary requst parameters not found. Check request body again.');
    }
}

export function checkAdminPriviledges() {
    if(identity_config.identityName != 'user1') {
        throw new Error("User has no privilages to execute this action");
    }
}
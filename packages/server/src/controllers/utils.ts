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
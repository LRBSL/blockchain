const homedir = require('os').homedir();

export function getKeyStore(identityOrg: string): string {
    // return process.env.KEYSTORE || '/' + homedir + '/hyperledger-fabric-network/.hfc-' + identityOrg;
    return process.env.KEYSTORE || '/config/.hfc-' + identityOrg;
}

export function getNetworkProfile(identityOrg: string): string {
    // return process.env.NETWORKPROFILE || '/' + homedir + '/hyperledger-fabric-network/network-profiles/' + 
    // identityOrg + '.network-profile.inside-docker.yaml';
    return process.env.NETWORKPROFILE || '/config/network-profiles/' + identityOrg + '.network-profile.inside-docker.yaml';
}
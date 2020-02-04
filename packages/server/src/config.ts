const homedir = require('os').homedir();

export const basic_config = {
    chaincode: process.env.CHAINCODE || "land",
    channel: process.env.CHANNEL || "ch1"
}

export const identity_config = {
    identityId: process.env.IDENTITYID || "admin",
    identityName: process.env.IDENTITY || "admin",
    identityOrg: process.env.ORG || "org1"
}

export const security_config = {
    keyStore: process.env.KEYSTORE || '/' + homedir + '/hyperledger-fabric-network/.hfc-' + identity_config.identityOrg,
    networkProfile: process.env.NETWORKPROFILE || '/'+ homedir + '/hyperledger-fabric-network/network-profiles/' + 
    identity_config.identityOrg + '.network-profile.yaml'
}

export function updateSecurityConfig() {
    security_config.keyStore = '/' + homedir + '/hyperledger-fabric-network/.hfc-' + identity_config.identityOrg;
    security_config.networkProfile = '/'+ homedir + '/hyperledger-fabric-network/network-profiles/' + 
    identity_config.identityOrg + '.network-profile.yaml';
}

export const port = process.env.PORT || 8000;

export const ca_ports = {
    org1: 7054,
    org2: 7154,
    org3: 7254
}

export const couchDBView = process.env.COUCHDBVIEW || 'ch1_coffee';
export const couchDBProtocol = process.env.COUCHDB_PROTOCOL || 'http';
export const couchDBHost = process.env.COUCHDB_HOST || 'localhost';
export const couchDBPort = process.env.COUCHDB_PORT || 5084;
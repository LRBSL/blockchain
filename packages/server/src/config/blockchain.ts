export const bc_config = {
    chaincode: process.env.CHAINCODE || "land",
    channel: process.env.CHANNEL || "ch1"
}

export const ca_ports = {
    org1: 7054,
    org2: 7154,
    org3: 7254
}

export const couchDBView = process.env.COUCHDBVIEW || 'ch1_coffee';
export const couchDBProtocol = process.env.COUCHDB_PROTOCOL || 'http';
export const couchDBHost = process.env.COUCHDB_HOST || 'localhost';
export const couchDBPort = process.env.COUCHDB_PORT || 5084;
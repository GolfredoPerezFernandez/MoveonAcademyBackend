//Contracts Access
const contracts: {
    token: string;
    auction: string;
    collection: string;
} = { 
    token: "0x11142365DDbc92C3547b8A074289409B5432CA8b",
    auction: '0x40c4D8e48517B76a2339a6d146242d836832Fd96',
    collection: "0x1C7d04C4DDEE4d13c31E800568039AcEabDCc3C8"
}

const chainID: {

    mainNet: string 
    testNet: string 

} = {
    mainNet: '',
    testNet: '0x13881'
}



export { 
    contracts,
    chainID
};
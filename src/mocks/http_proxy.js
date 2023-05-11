import {jest} from '@jest/globals';

jest.unstable_mockModule('http-proxy',()=>({
    default:{
        createServer:(opts)=>({
            listen:(port)=>"mock-proxy-server"
        })
    }
}));

export default await import('http-proxy');
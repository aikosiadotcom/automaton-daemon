import {jest} from '@jest/globals';

jest.unstable_mockModule('portfinder',()=>({
    default:{
        setBasePort:(port)=>({
        }),
        setHighestPort:(port)=>({
        }),
        getPortPromise:()=>{
            return 9999;
        }
    }
}));

export default await import('portfinder');
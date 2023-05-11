import {jest} from '@jest/globals';

jest.unstable_mockModule('public-ip',()=>({
    publicIpv4:()=>"mock"
}));

export default await import('public-ip');
import {jest} from '@jest/globals';

jest.unstable_mockModule('playwright',()=>({
    chromium:{
        launchPersistentContext:(profilePath,opts)=>({
        })
    }
}));

export default await import('playwright');
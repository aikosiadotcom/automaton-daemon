import {describe,test,expect ,jest} from '@jest/globals';
import ProfileManager from './profile_manager.js';

test('getDefaultManifest',()=>{
    expect(ProfileManager.getDefaultManifest({autoStart:false})).toHaveProperty("autoStart",false);
})
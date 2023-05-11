import path from 'path';
import dir from 'node-directories';
import fsExtra from 'fs-extra';
import {App} from '@aikosia/automaton-core';

/**
 * @typedef ProfileManager~Profile
 * @property {string} name - name of the profile
 * @property {string} root - absolute path of the profile
 */

/**
 * To manage profile folder
 * @category API
 * @extends external:App
 */
class ProfileManager extends App{
    constructor(){
        super({key:"Daemon",childKey:"ProfileManager"});
    }

    /**
     * Create a profile folder
     * @param {string} name 
     * @throws if the profile folder with same name exists.
     */
    async create(name){
        const newProfile = path.join(this.explorer.path["profile"],name);
        if(await fsExtra.exists(newProfile)){
            throw new Error(`'${name}' exists. Please remove it first at '${newProfile}'`);
        }

        await fsExtra.ensureDir(newProfile,0o2777);
    }

    /**
     * To get metadata about profiles
     * @param {string} [name=""] - if name is empty then will return all
     * @returns {Promise<Array.<ProfileManager~Profile>>}
     */
    async get(name = ""){
        const root = this.explorer.path["profile"];
        const lists = dir(root);
        const profiles = [];
        for(let i=0;i<lists.length;i++){
            const val = lists[i];
            profiles.push({
                name:val,
                root:path.join(root,val)
            });
        }

        //make sure there's always a default profile
        if((profiles.filter((val)=>val.name==='default')).length == 0){
            return await this.create('default');
        }

        if(name.length){
            return profiles.filter((val)=>val.name == name);
        }

        return profiles;
    }

    /**
     * To delete a profile
     * @param {string} name 
     */
    async delete(name){
        const profiles = await this.get(name);
        if(profiles.length){
            await fsExtra.rmdir(profiles[0].root);
        }else{
            throw new Error(`${name} not found.`);
        }
    }
}

export default ProfileManager;
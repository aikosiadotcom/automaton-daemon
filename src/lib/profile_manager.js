import path from 'path';
import dir from 'node-directories';
import json from "jsonfile";
import fsExtra from 'fs-extra';
import {System} from '@aikosia/automaton-core';

class ProfileManager{
    
    static getDefaultManifest(data = {}){
        return {
            "version":"1.0.0",
            "autoStart":true,
            ...data
        }
    }

    async create(name){
        const newProfile = path.join(await this.getPath("profile"),name);
        if(await fsExtra.exists(newProfile)){
            console.error(`${name} exists`);
            return;
        }

        await fsExtra.ensureDir(newProfile,0o2777);
        await json.writeFile(path.join(newProfile,"automaton.json"),ProfileManager.getDefaultManifest({
            // autoStart:option.autoStart
        }));

        console.log("profile created successfully");
    }

    async get(){
        const absPath = await this.getPath("profile");
        const lists = dir(absPath);
        const profiles = [];
        for(let i=0;i<lists.length;i++){
            const val = lists[i];
            profiles.push({
                id:val,
                absPath:path.join(absPath,val),
                manifest:await json.readFile(path.join(absPath,val,"automaton.json"))
            });
        }

        //default profile
        if(lists.length === 0){
            await this.create("default");
        }

        return profiles;
    }

    
    async getPath(folderName = ""){
        return System.getPath(folderName);
    }
}

export default ProfileManager;
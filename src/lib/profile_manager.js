import path from 'path';
import dir from 'node-directories';
import json from "jsonfile";
import fsExtra from 'fs-extra';
import envPaths from 'env-paths';

class ProfileManager{
    
    static getDefaultManifest(data = {}){
        return {
            "version":"1.0.0",
            "autoStart":true,
            ...data
        }
    }

    async create(name){
        const newProfile = path.join(await this.getPath(process.env.AUTOMATON_PATH_KEY_PROFILE),name);
        if(await fsExtra.exists(newProfile)){
            console.error(`${name} exists`);
            return;
        }

        await fsExtra.ensureDir(newProfile,0o2777);
        await json.writeFile(path.join(newProfile,process.env.AUTOMATON_FILENAME_MANIFEST_PROFILE),ProfileManager.getDefaultManifest({
            // autoStart:option.autoStart
        }));

        console.log("profile created successfully");
    }

    async get(){
        const absPath = await this.getPath(process.env.AUTOMATON_PATH_KEY_PROFILE);
        const lists = dir(absPath);
        const profiles = [];
        for(let i=0;i<lists.length;i++){
            const val = lists[i];
            profiles.push({
                id:val,
                absPath:path.join(absPath,val),
                manifest:await json.readFile(path.join(absPath,val,process.env.AUTOMATON_FILENAME_MANIFEST_PROFILE))
            });
        }

        //default profile
        if(lists.length === 0){
            await this.create("default");
        }

        return profiles;
    }

    
    async getPath(folderName = ""){

        const folder = envPaths(process.env.NODE_ENV != 'production' ? `automaton-dev` :  'automaton', {
            suffix:"",
        });

        folder.profile = path.join(folder.data,process.env.AUTOMATON_PATH_KEY_PROFILE);


        //pastikan foldernya sudah dibuat, jika tidak dibuat, maka buatkan
        // TODO: ini ke depan harus dioptimasi, karena getPath banyak digunakan
        for(let [key,value] of Object.entries(folder)){
            await fsExtra.ensureDir(value);
        }

        if(folderName != ""){
            return folder[folderName];
        }


        return folder;
    }
}

export default ProfileManager;
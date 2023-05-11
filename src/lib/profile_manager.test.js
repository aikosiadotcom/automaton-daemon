import {describe,test,expect ,jest} from '@jest/globals';
import {Tests} from "@aikosia/automaton-core";
import {resolve} from 'import-meta-resolve';

await Tests.createMockApp(jest);
const ProfileManager = (await import(resolve('#lib/profile_manager',import.meta.url))).default; 

describe("given ProfileManager class",()=>{
    describe("when create method is called",()=>{
        test('then all should be passed',async()=>{
            const instance = new ProfileManager();
            expect(JSON.stringify(await instance.get())).toContain("\"name\":\"default\"");
            await expect(async()=>await instance.create()).rejects.toThrow();
            await expect(async()=>await instance.create("default")).rejects.toThrow();
            expect((await instance.get("@@@@@@")).length).toBe(0);
            expect((await instance.get("default")).length).toBe(1);
            expect((await instance.get()).length).toBeGreaterThan(0);
        });
    });
});
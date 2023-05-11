import {describe,test,expect ,jest} from '@jest/globals';
import {Tests} from "@aikosia/automaton-core";
import {resolve} from 'import-meta-resolve';

await Tests.createMockApp(jest);
await import(resolve('#mock/playwright',import.meta.url)); 
await import(resolve('#mock/http_proxy',import.meta.url)); 
await import(resolve('#mock/portfinder',import.meta.url)); 
await import(resolve('#mock/public_ip',import.meta.url)); 
const BrowserManager = (await import(resolve('#lib/browser_manager',import.meta.url))).default; 

describe("given BrowserManager class",()=>{
    describe("when instance is created",()=>{
        test('then all should be passed',async()=>{
            const instance = new BrowserManager();
            await instance.run();
            expect(instance.get("default")).toEqual({
                instance:{},
                port:9999,
                url:"http://mock:9999",
                proxy:{
                    instance:"mock-proxy-server",
                    port:9999
                }
            });
        });
    });
});
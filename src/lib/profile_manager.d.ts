export default ProfileManager;
/**
 * ~Profile
 */
export type ProfileManager = {
    /**
     * - name of the profile
     */
    name: string;
    /**
     * - absolute path of the profile
     */
    root: string;
};
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
declare class ProfileManager {
    /**
     * Create a profile folder
     * @param {string} name
     * @throws if the profile folder with same name exists.
     */
    create(name: string): Promise<void>;
    /**
     * To get metadata about profiles
     * @param {string} [name=""] - if name is empty then will return all
     * @returns {Promise<Array.<ProfileManager~Profile>>}
     */
    get(name?: string): Promise<Array<ProfileManager>>;
    /**
     * To delete a profile
     * @param {string} name
     */
    delete(name: string): Promise<void>;
}

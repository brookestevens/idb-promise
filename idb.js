class IDBPromise {
    /**
     * 
     * @param {object} config 
     */
    constructor(config){
        this.options = {
            autoIncrement : false
        }
        this.name = config.dbName;
        if(config.autoIncrement === true){
            this.options.autoIncrement = true;
        }
        if(config.keyPathName){ 
            this.options.keyPath = config.keyPathName;
        }
        this.idb = new Promise((resolve, reject) => {
            if(window.indexedDB === undefined){
               reject("IDB not available");
            }
            const db = indexedDB.open(this.name, 1);
            db.onupgradeneeded = event => {
                let _db = db.result;
                _db.onerror = err => {
                    reject(err);
                }
                for(let i=0; i< config.stores.length; i++){
                    _db.createObjectStore(config.stores[i], this.options);
                }
            }
            db.onsuccess = e => resolve(db.result);
        });
    }

    /**
     * 
     * @param {string} storeName 
     * @param {object} value
     * @return {none} 
     */
    addItem(storeName, value){
        this.idb.then(db => {
            let objectStore = db.transaction([storeName], "readwrite").objectStore(storeName);
            value = JSON.parse(JSON.stringify(value));
            if(this.options.keyPath === undefined && this.options.autoIncrement === false){
                throw new Error("Cannot add a new value with no key. To set a value for a key/pair only store, use the updateItem() method. The store name will be used as the key.");
            }
            else{
                objectStore.add(value);
            }
        })
        .catch(err => console.error(err));
    }
    /**
     * 
     * @param {string} storeName 
     * @param {object} value 
     * @param {optional | number} id 
     */
    updateItem(storeName, value, id = null){
        let _id = id || storeName;
        this.idb.then(db => {
            let objectStore = db.transaction([storeName], "readwrite").objectStore(storeName);
            value = JSON.parse(JSON.stringify(value));
            if(this.options.keyPath){
                objectStore.put(value);
            }
            else{
                objectStore.put(value, _id);
            }
        })
        .catch(err => console.error(err));
    }
    /**
     * 
     * @param {string} storeName 
     * @param {number} id 
     */
    deleteItem(storeName, id){
        this.idb.then(db => {
            let objectStore = db.transaction([storeName], "readwrite").objectStore(storeName);
            objectStore.delete(id);
        })
    }

    /**
     * 
     * @param {string} storeName 
     * @return {promise}
     */
    getAllItems(storeName){
        return new Promise((resolve, reject) => {
            this.idb.then( db => {
                let objectStore = db.transaction([storeName], "readwrite").objectStore(storeName);
                let objectStoreRequest = objectStore.getAll();
                objectStoreRequest.onsuccess = (event) => resolve(objectStoreRequest.result);
                objectStoreRequest.onerror = (err) => reject(err);
            })
           .catch(err => console.error(err));
        });
    }
}

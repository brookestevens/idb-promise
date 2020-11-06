## Indexed DB Class
A class for using indexedDB without callbacks. For usage in the browser without any
need of modules.

## How to Use

````
Include the class
<script src="path/to/idb.js" />
````

### Creatae a new DB connection

````
let config = {
    dbName: string,
    stores: array of store names,
    autoIncrement: true | false,
    keyPathName: string | null
}
let db = new IDBPromise(config);
````

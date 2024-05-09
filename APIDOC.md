# Alert Hub GraphQL Client Usage Guide

## Introduction to GraphQL Client

### Client Name
Altair: https://altairgraphql.dev/

### Installation Guide

1. Add Chrome extension: https://chrome.google.com/webstore/detail/altair-graphql-client/flnheeellpciglgpaodhkhmapeljopja
2. Enable the extension and start it.
3. Install [altair-graphql-plugin-graphql-explorer](https://altairgraphql.dev/docs/plugins/popular-plugins#altair-graphql-plugin-graphql-explorer) for the altair graphql extension. Once you are in the altair client, follow the following instructions to install the plugins.
    1. Go to the settings icon of your browser
    2. Click settings
    3. Click `Toggle advanced mode`
    4. Add the below block in already existing configuration file.

    ```
    "plugin.list": [
       "altair-graphql-plugin-graphql-explorer"
    ]
    ```

For more information, you can visit [altair plugins](https://altairgraphql.dev/docs/plugins/).

## Project Configuration

### Add Schema
* Go to the [alert-hub-backend](https://github.com/IFRCGo/alert-hub-backend) repository and download the [schema.graphql](https://github.com/IFRCGo/alert-hub-backend/blob/develop/schema.graphql) file
*Note: The schema file might change in the future. Make sure to use the latest one*
* Click `Docs` in Altair
![image](https://github.com/IFRCGo/alert-hub-backend/assets/47474980/d0ce58ba-f2a6-4007-b679-2033109fa9a5)
* Click the options button ``...`` and click `Load Schema...`
![image](https://github.com/IFRCGo/alert-hub-backend/assets/47474980/e6f01cba-2408-497e-b1be-8bc3b29e475e)

* Select and load the download schema file

### Add GraphQL URL
* Go to the [alert-hub](https://alert-hub.westeurope.cloudapp.azure.com/map) staging platform and inspect the page
* Go to the `Network` tab and click **Fetch/XHR** button
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a208.png)

* Click on **graphql** and copy the request URL in the `Header` tab
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a209.png)

* Paste the request URL in the `Enter URL` text field
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a20a.png)

### Running a Query
* Open GraphQL explorer on the left panel
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a20b.png)
* Select the query you want to run along with the parameters you want to value for
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a20c.png)
* Click on the green `Send Request` button on top right or the `(Send query MyQuery)` button directly above the query
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a20d.png)
* The response will be displayed on the right panel

### Running a Query using variables
    NOTE: Variables can only be used with the queries that accept arguments
    
* Click on `VARIABLES` below the query window
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a20e.png)

* Add the variable you reuse most of the time in JSON
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a210.png)

* Select the query you want to run and pass the variable to it
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a211.png)

* Add ID type and make it mandatory by editing `query MyQuery` and adding ($id: ID!) right next to it
```
NOTE: Follow the same pattern for other arguments
```
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a212.png)


* Run the query and the response will be displayed on the right panel
```
Please follow this [official GraphQL document](https://graphql.org/learn/) for more information on how to use Graphql.
```
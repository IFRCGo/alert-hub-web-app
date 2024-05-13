# Alert Hub GraphQL Client Usage Guide

## Introduction to GraphQL Client

### Client Name
Altair: https://altairgraphql.dev/

### Installation Guide

1. Add Chrome extension: https://chrome.google.com/webstore/detail/altair-graphql-client/flnheeellpciglgpaodhkhmapeljopja
2. Enable the extension and start it.
3. Once you are in the altair client, install [altair-graphql-plugin-graphql-explorer](https://altairgraphql.dev/docs/plugins/popular-plugins#altair-graphql-plugin-graphql-explorer) for the altair graphql extension. For installation follow the following instructions.
    1. Go to the settings icon of Altair client
    2. Click settings
    3. Click `Toggle advanced mode`
    4. Add the below block in already existing configuration file.

    ```
    "plugin.list": [
       "altair-graphql-plugin-graphql-explorer"
    ]
    ```
    ![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a213.png)
    5. Save the changes
    6. Reload the window

For more information, you can visit [altair plugins](https://altairgraphql.dev/docs/plugins/).

## Project Configuration

### Add Schema
* Go to the [alert-hub-backend](https://github.com/IFRCGo/alert-hub-backend) repository and download the [schema.graphql](https://github.com/IFRCGo/alert-hub-backend/blob/develop/schema.graphql) file
    *Note: The schema file might change in the future. Make sure to use the latest one*
* Click `Docs` in Altair
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a215.png)

* Click the options button ``...`` and click `Load Schema...`
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a216.png)

* Select and load the downloaded schema file

### Add GraphQL URL
* Go to the `Alert Hub` staging platform and inspect the page
* Go to the `Network` tab and click **Fetch/XHR** button

* Click on **graphql** and copy the request URL in the `Header` tab
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a209.png)

* Paste the request URL in the `Enter URL` text field
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a217.png)

### Running a Query
* Open GraphQL explorer on the left panel
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a218.png)

* Select the query you want to run along with the parameters you want to value for
* Click on the green `Send Request` button on top right or the `(Send query MyQuery)` button directly above the query
* The response will be displayed on the right panel

### Running a Query using variables

*NOTE: Variables can only be used with the queries that accept arguments*
    
* Click on `VARIABLES` below the query window

* Add the variable you reuse most of the time in JSON

* Select the query you want to run and pass the variable to it
![image](https://s3-ap-southeast-1.amazonaws.com/tc-codimd/uploads/a575a073f6aa81839c739a219.png)

* Add ID type and make it mandatory by editing `query MyQuery` and adding `($id: ID!)` right next to it
*NOTE: Follow the same pattern for other arguments*

* Run the query and the response will be displayed on the right panel

*Please follow this [official GraphQL document](https://graphql.org/learn/) for more information on how to use Graphql.*

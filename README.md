# ee-config

gets & sets config values from a mysql db. depeds on a config file ( config.js in the project root )

   var config = require( "ee-config" );


   config.get( "key" );
   config.set( "key", "value" );



config file:

    module.exports = {
          database:         "dbName"
        , hosts: [
            {
                  host:     "1dbHsot"
                , user:     "dbUser"
                , password: "dbPass"
                , weight:   "optional int ( used for load balancing )"
                , writable: true
            }
        ]
    };


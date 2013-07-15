

	var config 	= require( "./" )
		, log 	= require( "ee-log" );


	config.get( "env", function( value ){
		log.dir( value );
	} );


	config.on( "load", function(){
		log.dir( config.get( "env" ) );
	} );



	config.set( "test", Math.random() );

	config.get( "test", function( value ){
		log.dir( value );
	} );





	


	var   Class 		= require( "ee-class" )
		, Events 		= require( "ee-event" )
		, log 			= require( "ee-log" )
		, Schema 		= require( "ee-mysql-schema" )
		, project 		= require( "ee-project" );



	module.exports = new Class( {
		inherits: Events

		, loaded: false
		, config: {}


		, init: function(){
			this.schema = new Schema( project.config );
			this.schema.on( "load", function(){
				if ( !this.schema.config ) log.warn( "no config table found!" );
				else {
					this.schema.config.fetchAll( function( err, rows ){
						if ( err ) throw err;
						else {
							rows.forEach( function( row ){
								if( !this.config[ row.key ] ) this.config[ row.key ] = row.value; 
							}.bind( this ) );

							this.loaded = true;
							this.emit( "load" );
						}
					}.bind( this ) );
				}
			}.bind( this ) );
		}


		, get: function( key, callback ){
			if ( !this.loaded && !callback ) throw new Error( "cannot get config value because the config is not laoded yet!" );

			if ( callback ){
				if ( this.loaded ) callback( this.config[ key ] );
				else this.on( "load", function(){
					this.get( key, callback );
				}.bind( this ) );
			}
			else return this.config[ key ];
		}


		, set: function( key, value, callback ){
			var originalValue = this.config[ key ];
			this.config[ key ] = value;

			if ( this.loaded ){
				this.schema.config.findOne( { key: key }, function( err, row ){
					if ( err ){
						if ( callback ) callback( err );
						else throw err;

						// reset value unless it was overwritted meanwhile
						if ( this.config[ key ] === value ) this.config[ key ] = originalValue;
					} 
					else {
						// handles the callback for the save calls on the row
						var handleReturn = function( err ){
							if ( err ){
								if ( callback ) callback( err );
								else throw err;

								// reset value unless it was overwritted meanwhile
								if ( this.config[ key ] === value ) this.config[ key ] = originalValue;
							}
							else if ( callback ) callback();
						}.bind( this );


						// update / create row
						if ( row ){
							row.value = value;
							row.save( handleReturn );
						}
						else {
							new this.schema.config( { key: key, value: value } ).save( handleReturn );
						}
					}
				}.bind( this ) );
			}
			else {
				this.on( "load", function(){
					this.set( key, value, callback );
				}.bind( this ) );
			}
		}
	} );
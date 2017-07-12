/*
 * Bootstrap-based responsive mashup
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );

var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
//to avoid errors in workbench: you can remove this when you have added an app
var app;
require.config( {
	baseUrl: (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + config.prefix + "resources"
} );

require( ["js/qlik"], function ( qlik ) {

	var control = false;
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		if ( !control ) {
			control = true;
			$( '#popup' ).delay( 1000 ).fadeIn( 1000 ).delay( 11000 ).fadeOut( 1000 );
		}
	} );

	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );
	if ( $( 'ul#qbmlist li' ).length === 0 ) {
		$( '#qbmlist' ).append( "<li><a>Não há marcadores disponíveis</a></li>" );
	}
	$( "body" ).css( "overflow: hidden;" );
	function AppUi ( app ) {
		var me = this;
		this.app = app;
		app.global.isPersonalMode( function ( reply ) {
			me.isPersonalMode = reply.qReturn;
		} );
		app.getAppLayout( function ( layout ) {
			$( "#title" ).html( layout.qTitle );
			$( "#title" ).attr( "title", "Last reload:" + layout.qLastReloadTime.replace( /T/, ' ' ).replace( /Z/, ' ' ) );
			//TODO: bootstrap tooltip ??
		} );
		app.getList( 'SelectionObject', function ( reply ) {
			$( "[data-qcmd='back']" ).parent().toggleClass( 'disabled', reply.qSelectionObject.qBackCount < 1 );
			$( "[data-qcmd='forward']" ).parent().toggleClass( 'disabled', reply.qSelectionObject.qForwardCount < 1 );
		} );
		app.getList( "BookmarkList", function ( reply ) {
			var str = "";
			reply.qBookmarkList.qItems.forEach( function ( value ) {
				if ( value.qData.title ) {
					str += '<li><a data-id="' + value.qInfo.qId + '">' + value.qData.title + '</a></li>';
				}
			} );
			str += '<li><a data-cmd="create">Criar</a></li>';
			$( '#qbmlist' ).html( str ).find( 'a' ).on( 'click', function () {
				var id = $( this ).data( 'id' );
				if ( id ) {
					app.bookmark.apply( id );
				} else {
					var cmd = $( this ).data( 'cmd' );
					if ( cmd === "create" ) {
						$( '#createBmModal' ).modal();
					}
				}
			} );
		} );
		$( "[data-qcmd]" ).on( 'click', function () {
			var $element = $( this );
			switch ( $element.data( 'qcmd' ) ) {
				//app level commands
				case 'clearAll':
					app.clearAll();
					break;
				case 'back':
					app.back();
					break;
				case 'forward':
					app.forward();
					break;
				case 'lockAll':
					app.lockAll();
					break;
				case 'unlockAll':
					app.unlockAll();
					break;
				case 'createBm':
					var title = $( "#bmtitle" ).val(), desc = $( "#bmdesc" ).val();
					app.bookmark.create( title, desc );
					$( '#createBmModal' ).modal( 'hide' );
					break;
					//var app = qlik.openApp('5d650a4b-588b-4314-a8a1-aa523a73ce26', config);
			}
		} );
	}

	//callbacks -- inserted here --
	//open apps -- inserted here --
	
	var app = qlik.openApp('dc8018f9-da87-422f-b5d2-e28a6d6400ab', config);

	//get objects -- inserted here --
	app.getObject('QV01','wGJChe'); // Logo DAF
    app.getObject('QV02','Xpgc'); // Data e hora da última atualização
    app.getObject('QV03','cc09dfc5-9d2d-41bd-ae5f-ec9e2cb1f227'); // Painel de filtros
    	app.getObject('QV19','znemB'); // Filtro Coordenação
        app.getObject('QV20','DGPQr'); // Filtro Utilização
        app.getObject('QV21','UuCYy'); // Filtro Modalidade
        app.getObject('QV22','pJFJhQ'); // Filtro Problema
        app.getObject('QV23','Fudrskr'); // Filtro Fornecedor
        app.getObject('QV24','VcMjhWN');  // Filtro Limite para Aquisição
        app.getObject('QV25','YvKsm'); // Filtro Aquisição em andamento
        app.getObject('QV26','Hwh'); // Filtro Atualização
    app.getObject('QV04','cfa97e9a-93cc-42a2-8326-0593f6f3b4f7'); // Risco
    app.getObject('QV05','9b34883d-2e05-4067-a42f-edbc1fbcb770'); // Coordenação
    app.getObject('QV07','KvRuyQ'); // Tabela de Insumos
    app.getObject('QV06','RJguppj'); // Botão Tabela de Insumos
    app.getObject('QV08','75bcb591-ba45-4463-bb60-0d5e48d29393'); // Legenda Risco
    app.getObject('QV09','4e08cab0-1c56-47f9-abe2-bb9ed42015c1'); // Linha horizontal
    app.getObject('QV10','549af521-8d6b-4f4f-bcfa-674c58b5049e'); // Linha vertical
    app.getObject('QV11','c06af058-877a-4da7-bc5a-368d7d07d76b'); // Modalidade Processo Aquisição
	app.getObject('QV12','NtuNhC'); // Fornecedores D3
    app.getObject('QV14','AUkfVy'); // Utilização
	app.getObject('QV15','GTHnpwJ'); // Tipo de Problema
	app.getObject('QV16','f0b407c7-e538-44de-b4e4-42994f3fbf1a'); // Histórico Semanal
	app.getObject('QV17','201d586e-4a88-40e4-9ab7-b1149d5100f2'); // Botão Histórico Semanal
    app.getObject('QV18','7e833c0c-dc0f-497a-a13d-5f068985ac42'); // Tabela Dinâmica
	
	//create cubes and lists -- inserted here --
	if ( app ) {
		new AppUi( app );
	}

} );

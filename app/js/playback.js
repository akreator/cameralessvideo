$( document ).ready( function() {

	var audio1 = new Audio('/imgs/dialup.wav');
	var audio2 = new Audio('/imgs/dialup.wav');
	var audio3 = new Audio('/imgs/dialup.wav');
	var errorAudio = new Audio('/imgs/error.wav');
	var popupAudio = new Audio('/imgs/ding.wav');
	var buggles = new Audio('/imgs/buggles.mp3');
	var uWon = new Audio('/imgs/uWon.wav');

	setTimeout(function() {
		window.open('/camera1', '_blank', 'height=230,width=300,top=50,left=20');
		audio1.play();
		popupAudio.play();
	}, 10000);
	setTimeout(function() {
		popupAudio.play();
		window.open('/camera2-no', '_blank', 'height=180,width=400,top=285,left=130');
	}, 16700);
	setTimeout(function() {
		audio2.play();
		popupAudio.play();
		window.open('/video1', '_blank', 'height=300,width=400,top=300,left=800,titlebar=no');
	}, 15000);
	setTimeout(function() {
		popupAudio.play();
		buggles.play();
		window.open('/camera2-yes', '_blank', 'height=270,width=450,top=100,left=890');
	}, 19500);
	setTimeout(function() {
		popupAudio.play();
		window.open('/camera3', '_blank', 'height=230,width=250,top=100,left=200');
	}, 23500);
		setTimeout(function() {
			popupAudio.play();
		window.open('/video2', '_blank', 'height=230,width=300,top=50,left=20');
	}, 21300);
		setTimeout(function() {
			popupAudio.play();
		audio3.play();
		window.open('/video2-yes', '_blank', 'height=230,width=250,top=270,left=0');
	}, 22000);
		setTimeout(function() {
			uWon.play();
			popupAudio.play();
		window.open('/video2-no', '_blank', 'height=500,width=500,top=79,left=573');
	}, 22300);
		setTimeout(function() {
			popupAudio.play();
		window.open('/video2-yes', '_blank', 'height=150,width=300,top=700,left=670');
	}, 21000);
		setTimeout(function() {
			popupAudio.play();
		window.open('/why', '_blank', 'height=230,width=300,top=500,left=325');
	}, 17000);
		setTimeout(function() {
			popupAudio.play();
		window.open('/why', '_blank', 'height=230,width=300,top=8,left=600');
	}, 23000);
		
	var playbackBarContainer = $('#playback-bar-container');
	var playbackBar = $('#playback-bar');
	var playbackImg = $('#playback-img');
	console.log('loaded');
	var width;
	var maxWidth;
	var startTime = Date.now();
	var elapsedTime = 0;
	var maxTime = 8000;

	setupBar();

	function setupBar() {
		let maxWidth = playbackImg.width();
		playbackBarContainer.width(maxWidth);
		if (playbackBar.width() >= maxWidth-1) {
			startTime = Date.now();
			elapsedTime = 0;
			playbackBar.width(0);
		}
		playbackBar.animate({width: '100%'}, maxTime - elapsedTime, 'linear', setupBar);	
	}

	$('#play-btn').click(function() {
		setupBar();
		startTime = Date.now();
		$('#pause-btn').show();
		$('#play-btn').hide();
	});

	$('#pause-btn').click(function() {
		playbackBar.stop();
		elapsedTime += Date.now() - startTime;
		$('#play-btn').show();
		$('#pause-btn').hide();
	});

});

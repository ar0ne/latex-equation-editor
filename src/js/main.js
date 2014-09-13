$(function(){
	"use strict";

	var editor  = $('#equation_editor'),
		img  	= $('#img_container'),
		form 	= $('#formForSaveImage');

	$('#table_container tr td').each(function(){
		$(this).click('on', function(){
			var old_text = editor.val();
			editor.val( old_text + $('img',this).attr('alt') + " ");
			editor.trigger('change'); // generate event 'change'
		});
	})

	// generate new equation image when we change some input value
	editor.bind("change keyup paste", function(){
		var formula = editor.val() != '' ? editor.val() : '...';

		img.html('').append("<img src='cgi-bin/mimetex.cgi?" + formula +"'></img>");
	})


	form.submit(function(event){
		event.preventDefault();

		var img_name = $(this).serializeArray()[0].value,
			img_src = img.find('img').attr('src');

		if(img_name.length == 0){
			$('#error_container').html('<p class="bg-danger" >Please, enter the pattern for names of images!</p>').fadeIn().delay(3000).fadeOut();
			return false;
		}

	    if(img_src == undefined || img_src == 'cgi-bin/mimetex.cgi?...'){
	    	$('#error_container').html('<p class="bg-danger" >Image not found</p>').fadeIn().delay(3000).fadeOut();
	    	return false;
	    }

		var reg1 = /(?!_)\d+$/, // index from numbers (123)
			reg2 = /\w+_/, // string pattern for images name (lection_)
			// if this is first saved image then index = 1
			index = reg1.exec(img_name) !== null ? reg1.exec(img_name)[0] : 1;

		img_name  = reg2.exec(img_name) !== null ? reg2.exec(img_name)[0] : img_name + '_';

		var filename = img_name + index + '.png';

		// trick with blob from FileSaver.js
		var canvas = document.createElement("canvas"),
	    	ctx = canvas.getContext("2d"),
	    	image = new Image();

		    image.onload = function () {
		        canvas.width = image.width;
		        canvas.height = image.height;
		        ctx.drawImage(image, 0, 0);

				canvas.toBlob(function(blob){
					saveAs(blob, filename);
				})
	   		};

		// write next pattern image name to input in form
		index ++;
		form.find('input').val(img_name + index);

		// call image.onload
		image.src = img_src;

	})

});


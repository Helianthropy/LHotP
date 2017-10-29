 $(document).ready(function(){
	 
	 $('td').click(function(){
		
		var toggle = this.style;
		toggle.backgroundColor = toggle.backgroundColor? "":"#d4edda";
		toggle.color = toggle.color? "":"#333";
	 });

 });


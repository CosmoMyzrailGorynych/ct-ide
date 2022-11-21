(function ctUlid(ct){

	ct.ulid = {
		randomizr(){
			ct.ulid.rn = Math.random().toString(16).slice(-4); 
			return ct.ulid.rn;
		},
		make(){
			
			ct.ulid.uuid = 
			ct.ulid.randomizr()
				+ ct.ulid.randomizr() 
				+ '-' + 
				ct.ulid.randomizr()
				+ '-' + 
				ct.ulid.randomizr()
				+ '-' + 
				ct.ulid.randomizr()
				+ '-' + 
				ct.ulid.randomizr()
				+ ct.ulid.randomizr()
				+ ct.ulid.randomizr();
		
			return ct.ulid.uuid;
		},
		crandomizr(number){
			ct.ulid.rn = Math.random().toString(32).slice(-number); 
			return ct.ulid.rn;
		},
		custom(){

			ct.ulid.uuid = 
			ct.ulid.crandomizr([/*%cregex1%*/][0])
			+'-'+
			ct.ulid.crandomizr([/*%cregex2%*/][0])
			+'-'+
			ct.ulid.crandomizr([/*%cregex3%*/][0])
			+'-'+
			ct.ulid.crandomizr([/*%cregex4%*/][0])
			+'-'+
			ct.ulid.crandomizr([/*%cregex5%*/][0]);

			return ct.ulid.uuid;
		}

	}

})(ct);

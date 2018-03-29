var DsGis={
	version:'1.0.0',
	create:function(){
		return function(){
			this.init.apply(this,arguments);
		}
	}
}



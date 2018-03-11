tetris = {
	highPlan: 30,
	cellSize: 20,
	lengthPlan: 10,
	step: 1,
	stepScore: 1,
	score: 0,
	ctx: document.getElementById('plan').getContext('2d')
}; //инициализация базовых констант и конваса

tetris.plan = (
	function(){
		var matr = new Array();	//Создаем план
		for(var i = 0; i < tetris.highPlan; i++){
			matr[i] = new Array();
   			for(var j = 0; j < tetris.lengthPlan; j++)
    					matr[i][j] = 0;
   		};
   		return matr;
	}()
); //Создание стакана с фигурами

tetris.clear = ()=>tetris.ctx.clearRect(0, 0, tetris.lengthPlan * tetris.cellSize, tetris.highPlan * tetris.cellSize); // отчистка поля

tetris.draw = function(){
	tetris.ctx.fillStyle = "#00FF00";
	for (var y = 0; y < tetris.highPlan; y ++)
		for(var x = 0; x < tetris.lengthPlan; x ++)
			if (tetris.plan[y][x] == 1)
				tetris.ctx.fillRect(x * tetris.cellSize, y * tetris.cellSize, tetris.cellSize, tetris.cellSize);
}; //отрисовка стакана

tetris.del = function(){
	for(var i = 0; i < tetris.highPlan; i++){
		if ( !(tetris.plan[i]).includes(0) ) {
			tetris.score += tetris.stepScore
			for (var j = i; j > 0; j--) {
				tetris.plan[j] = tetris.plan[j - 1].slice();
			}
			tetris.plan[0].fill(0);
		}
	}
}; //удаление заполненных рядов #НЕ ПРОВЕРЕНО

tetris.block = {
	type: [],
	types: [
		[
			[1,1],
			[1,0],
			[1,0],
		],
		[
			[1,1],
			[1,1]
		],
		[
			[1,1,0],
			[0,1,1]
		],
		[
			[1,1,1],
			[0,1,0]
		],
		[
			[1],
			[1],
			[1],
			[1]
		],
		[
			[1,0,0],
			[1,1,0],
			[1,1,1]
		]
	],
	coordinate: []
}; // создаём объект блока
tetris.block.newBlock = function(){
		tetris.block.type =	tetris.block.types[Math.floor(Math.random() * tetris.block.types.length)].slice();
		tetris.block.coordinate = [];
		for (var i = tetris.block.type.length - 1; i >= 0; i--) {
			tetris.block.coordinate[i] = []
			for(var j = 0; j < tetris.block.type[i].length; j++)
				tetris.block.coordinate[i][j] = {
					x: Math.floor(tetris.lengthPlan / 2) + j,
					y: i * tetris.cellSize
				};
		};
}; // обновление объекта блока
tetris.block.draw = function(){
	for (var y = 0; y < tetris.block.type.length; y++)
		for(var x = 0; x < tetris.block.type[y].length; x++)
			if( tetris.block.type[y][x] == 1 )
					tetris.ctx.fillRect(tetris.block.coordinate[y][x].x * tetris.cellSize, tetris.block.coordinate[y][x].y,tetris.cellSize, tetris.cellSize);
};// отрмсовка блока
tetris.block.changeY = function(){
		for (var i = 0; i < tetris.block.type.length; i++)
			for(var j = 0; j < tetris.block.type[i].length; j++)
				tetris.block.coordinate[i][j].y += tetris.step;
};// смещение блока по высоте

tetris.block.canExist = function(coord){
	var itog = true;
	for(var i = 0; i < coord.length; i++)
	{	coord[i][5].y = 0;
		for(var j = 0; (j < coord[i].length); j++){
			if( (tetris.plan[coord[i][j].y][coord[i][j].x] == 1) /*|| 
				( (coord[i][j].y / tetris.cellSize >>0) >= tetris.highPlan ) ||
				(coord[i][j].x >= tetris.heighPlan)*/){
				itog = false;
			console.log('прполод');
			//console.log(coord[i][j].y / tetris.cellSize >> 0 + '   ' + coord[i][j].y / tetris.cellSize >> 0 + 1);
			};
		};
	};
	return itog;
};

tetris.block.fall = function(){
	var copyBlock = tetris.block.coordinate;
	return !tetris.block.canExist( copyBlock.map( function(string){
		return string.map(function(el){
			var c = Object.create(el);
			c.y = c.y / tetris.cellSize >> 0 + 1;
			return c;
		});
	} ) );
};// проверка упал ли блок #ПОПРАВИТЬ

tetris.block.addToPaln = function(){
	for(var i = 0; i < tetris.block.coordinate.length; i++){
		for(var j = 0; j < tetris.block.coordinate[i].length; j++){
			if(tetris.block.type[i][j] == 1){
				var el = tetris.block.coordinate[i][j];
				tetris.plan[(el.y / tetris.cellSize)>>0][el.x] = 1;
			};
		};
	};
};// добавления блока на план

tetris.plan[15][5] = 1; 
tetris.block.newBlock();

setInterval(function(){
		tetris.clear();
		tetris.draw();
		tetris.block.draw();
		tetris.block.changeY();
		if(tetris.block.fall()){
		//	tetris.del();
			tetris.block.addToPaln();
			tetris.block.newBlock();
		};
}, 50);
//инициализация базовых констант и конваса
tetris = {
	highPlan: 30,
	cellSize: 20,
	lengthPlan: 10,
	step: 1,
	stepScore: 1,
	score: 0,
	ctx: document.getElementById('plan').getContext('2d')
};

//Создание стакана с фигурами
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
);

// отчистка поля
tetris.clear = ()=>tetris.ctx.clearRect(0, 0, tetris.lengthPlan * tetris.cellSize, tetris.highPlan * tetris.cellSize); 

//отрисовка стакана
tetris.draw = function(){
	tetris.ctx.fillStyle = "#00FF00";
	for (var y = 0; y < tetris.highPlan; y ++)
		for(var x = 0; x < tetris.lengthPlan; x ++)
			if (tetris.plan[y][x] == 1)
				tetris.ctx.fillRect(x * tetris.cellSize, y * tetris.cellSize, tetris.cellSize, tetris.cellSize);
};

//удаление заполненных рядов #НЕ ПРОВЕРЕНО
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
};

// создаём объект блока
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
};

// обновление объекта блока
tetris.block.newBlock = function(){
		tetris.block.type =	tetris.block.types[Math.floor(Math.random() * tetris.block.types.length)].slice();
		tetris.block.coordinate = {
			x: Math.floor(tetris.lengthPlan / 2),
			y: 0
		};
}; 

// отрисовка блока
tetris.block.draw = function(){
	for (var i = 0; i < tetris.block.type.length; i++)
		for(var j = 0; j < tetris.block.type[i].length; j++)
			if( tetris.block.type[i][j] == 1 )
					tetris.ctx.fillRect( (tetris.block.coordinate.x + j) * tetris.cellSize,
										  tetris.block.coordinate.y + i * tetris.cellSize,
										  tetris.cellSize,
										  tetris.cellSize);
};

// смещение блока по высоте
tetris.block.changeY = function(){
				tetris.block.coordinate.y += tetris.step;
};

tetris.block.canExist = function(coord, form){
	var itog = true;
	coord.y = Math.floor(coord.y / tetris.cellSize);

	for(var i = 0; (i < form.length) && itog; i++)
		for(var j = 0; (j < form[i].length) && itog; j++)
			if(form[i][j] == 1)
					if( (tetris.plan[coord.y + i][coord.x + j] == 1) )
						itog = false;

	return itog;
};


tetris.block.fall = function(){
		var copy = Object.create(tetris.block.coordinate);
		copy.y += tetris.cellSize;
		return !tetris.block.canExist(copy, Object.create(tetris.block.type));
};

// добавления блока на план
tetris.block.addToPaln = function(){
	for(var i = 0; i < tetris.block.type.length; i++){
		for(var j = 0; j < tetris.block.type[i].length; j++){
			console.log(i+' '+j);
			console.log(tetris.block.type);
			if (tetris.block.type[i][j] == 1)
				tetris.plan[((tetris.block.coordinate.y / tetris.cellSize)>>0) + i][tetris.block.coordinate.x + j] = 1;
		};
	};
};

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
}, 80);
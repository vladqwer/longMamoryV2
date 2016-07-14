var indexedDB = window.indexedDB || window.mozIndexedDB
		|| window.webkitIndexedDB || window.msIndexedDB, IDBTransaction = window.IDBTransaction
		|| window.webkitIDBTransaction || window.msIDBTransaction;
var baseName = "filesBaselongmemoryV2";
var storeNameStorageDeck = "StorageDeck";
var storeNameCurrentDeck = "CurrentDeck";
var storeNameDeckName = "DeckName";
var countDeck = 0;
var dateRepeat = new Date(3001, 0, 1, 0, 0, 0, 0);
var CurrentDT = new Date();
var currentDeck = [];
var counter = 0;// /????
var counter2 = 0;
var currentDeckName = "def";
var countNewCard = 3;
var repeatCardCount=0;
function showAnswer()
{
	$('#answerOfLearnPage').css("visibility","visible");//покажет
}
function showAnswer2()
{
	$('#answerOfLearnPage').css("visibility","hidden");//спрячет
}
function logerr(err) {
	console.log(err);
}
function connectDB(f)// для хранения колод
{
	// console.log("hello");
	var d = new Date(3001, 0, 1, 0, 0, 0, 0);
	var request = indexedDB.open(baseName, 1);
	request.onerror = logerr;
	request.onsuccess = function() {
		f(request.result);

	};
	request.onupgradeneeded = function(e) {
		var some = e.currentTarget.result.createObjectStore("StorageDeck", {
			keyPath : "id"
		});
		some.createIndex("by_question", "question", {
			unique : true
		});
		some.createIndex("by_answer", "answer");
		some.createIndex("by_repeat", "repeat");
		some.createIndex("by_deck", "deck");
		some.createIndex("by_count", "count");
		some.createIndex("by_weight", "weight");
		some.put({
			id : 0,
			question : "how many",
			answer : "null",
			repeat : d,
			deck : "def",
			count : 0
		});
		var some = e.currentTarget.result.createObjectStore("CurrentDeck", {
			keyPath : "id"
		});
		some.createIndex("by_question", "question", {
			unique : true
		});
		some.createIndex("by_answer", "answer");
		some.createIndex("by_repeat", "repeat");
		some.createIndex("by_deck", "deck");
		some.createIndex("by_count", "count");
		some.put({
			id : 0,
			question : "how many",
			answer : "null",
			repeat : d,
			deck : "defDeck",
			count : 0,
			weight : 8
		});
		var some = e.currentTarget.result.createObjectStore("DeckName", {
			keyPath : "id"
		});
		some.createIndex("by_name", "name", {
			unique : true
		});
		some.createIndex("by_count", "count");
		some.put({
			id : 0,
			name : "defName",
			count : 0
		});
		connectDB(f);

	};
};
(function() {
	
	// alert(CurrentDT-dateRepeat);

	// d= new Date(); alert(d-dateRepeat);

	// dateRepeat.setMinutes(100, 0, 0)
	// alert(dateRepeat);
	// document.getElementById("text1ofSelectBase").value = countNewCard;
	// document.getElementById("text1ofDeckProperty").value = countNewCard;
	connectDB();
	(function refreshSelectDeck() {

		connectDB(function(db) {
			var request = db.transaction(storeNameDeckName, "readonly")
					.objectStore(storeNameDeckName).get(0);
			request.onerror = logerr;
			request.onsuccess = function() {

				countDeck = request.result.count;
				refreshSelectDeck1();

			};
		});

	})();
	document.getElementById("text1ofDeckProperty").value = countNewCard;
})();
function add_deck() {
	currentDeckName = document.getElementById("createpage-kol-name").value;
	var fileDeckParam = {
		id : 0,
		name : "defName",
		count : 0
	};
	(function() {
		connectDB(function(db)// забор количества
		{
			var request = db.transaction(storeNameDeckName, "readonly")
					.objectStore(storeNameDeckName).get(0);
			request.onerror = logerr;
			request.onsuccess = function() {

				countDeck = request.result.count;
				console.log(countDeck);
				(function()// добавление колоды
				{
					fileDeckParam = {
						id : countDeck + 1,
						name : currentDeckName,
						count : countDeck + 1
					};
					connectDB(function(db) {
						var request = db.transaction(storeNameDeckName,
								"readwrite").objectStore(storeNameDeckName)
								.put(fileDeckParam);
						request.onerror = logerr;// добавили
						request.onsuccess = function() {
							(function()// изменение нулевого
							{
								fileDeckParam = {
									id : 0,
									name : "defName",
									count : countDeck + 1
								};
								connectDB(function(db) {
									var request = db.transaction(
											storeNameDeckName, "readwrite")
											.objectStore(storeNameDeckName)
											.put(fileDeckParam);
									request.onerror = logerr;
									request.onsuccess = function() {
										console.log('true');
										return request.result;
									};
								});
							})();
							// return request.result;
						};
					});
				})();

			}
		});
	})();

}
function refreshSelectDeck() {

	connectDB(function(db) {
		var request = db.transaction(storeNameDeckName, "readonly")
				.objectStore(storeNameDeckName).get(0);
		request.onerror = logerr;
		request.onsuccess = function() {

			countDeck = request.result.count;
			refreshSelectDeck1();

		};
	});

}
function refreshSelectDeck1() {
	counter++;
	connectDB(function(db) {
		var request = db.transaction(storeNameDeckName, "readonly")
				.objectStore(storeNameDeckName).get(counter);
		request.onerror = logerr;
		request.onsuccess = function() {
			console.log(request.result.name);
			addopt(request.result.name);
			if (counter < countDeck)
				refreshSelectDeck1();
		}
	})

}
function addopt(nameOption)// добавление в список опций на главной странице
{
	var select = document.getElementById('s1');
	var newOption = new Option(nameOption, nameOption);
	select.appendChild(newOption);
	newOption.selected = true;
}
function selectDeck()// изменяет currentDeckName
{
	var select = document.getElementById("s1");
	for (var i = 0; i < select.options.length; i++) {
		var option = select.options[i];
		if (option.selected) {
			currentDeckName = option.value;
			// alert(currentDeckName);
		}
	}
}
function add_card() {
	console.log('add0');
	var countCard = 0;
	var d = new Date(3001, 0, 1, 0, 0, 0, 0);
	var fileForCard = {
		id : 0,
		question : "",
		answer : "",
		repeat : d,
		count : 0,
		deck : "def"
	};
	connectDB(function(db)// забор количества карточек
	{
		var request = db.transaction(storeNameStorageDeck, "readonly")
				.objectStore(storeNameStorageDeck).get(0);
		request.onerror = logerr;
		request.onsuccess = function() {

			countCard = request.result.count;
			console.log("карточек в колоде" + countCard);
			(function()// добавление карточки
			{
				var ques = document.getElementById("questionOfAddCard").value;
				var answ = document.getElementById("answerOfAddCard").value;
				fileForCard = {
					id : countCard + 1,
					question : ques,
					answer : answ,
					repeat : dateRepeat,
					count : countCard + 1,
					deck : currentDeckName,
					weight : 8
				};
				connectDB(function(db) {
					var request = db.transaction(storeNameStorageDeck,
							"readwrite").objectStore(storeNameStorageDeck).put(
							fileForCard);
					request.onerror = logerr;// добавили
					request.onsuccess = function() {
						(function()// изменение нулевого
						{
							fileForCard = {
								id : 0,
								question : "how many",
								answer : "null",
								repeat : dateRepeat,
								deck : "def",
								count : countCard + 1,
								weight : 8
							};
							connectDB(function(db) {
								var request = db.transaction(
										storeNameStorageDeck, "readwrite")
										.objectStore(storeNameStorageDeck).put(
												fileForCard);
								request.onerror = logerr;
								request.onsuccess = function() {
									console.log('true');
									// return request.result;
								};
							});
						})();
						// return request.result;
					};
				});
			})();

		}
	});

}
function editCOuntNewCard() {
	countNewCard = +document.getElementById("text1ofDeckProperty").value;
	$("#text1ofSelectBase").text(countNewCard);
	$("#text2ofSelectBase").text(repeatCardCount);
	
	
}
function EditTable(fileForCard) {
	if (currentDeckName == fileForCard.deck) {
		var table = document.getElementById('tableOfEditDeck');
		var tr = document.createElement('tr'); // создаем еще строку
		var td1 = document.createElement('td');
		td1.innerHTML = fileForCard.question; // создаем столбец
		var td2 = document.createElement('td');
		td2.innerHTML = fileForCard.answer; // создаем еще столбец
		var td3 = document.createElement('td');
		td3.innerHTML = fileForCard.repeat; // создаем еще столбец
		tr.appendChild(td1); // кладем в новосозданную строку первый
		// новосозданный столбец
		tr.appendChild(td2); // кладем в новосозданную строку второй
		// новосозданный столбец
		tr.appendChild(td3);
		table.appendChild(tr); // кладем в таблицу новосозданную строку
		// (последней)
	}
}
function refreshOnEditDeck() {
	$("#tableOfEditDeck > tr").remove();
	counter = 0;
	connectDB(function(db) {
		var request = db.transaction(storeNameStorageDeck, "readonly")
				.objectStore(storeNameStorageDeck).get(0);
		request.onerror = logerr;
		request.onsuccess = function() {
			(function() {
				countDeck = request.result.count;
				refreshOnEditDeck1();
			})();
		}
	});
}
function refreshOnEditDeck1() {
	var fileForCard = {
		id : 0,
		question : "",
		answer : "",
		repeat : dateRepeat,
		count : 0,
		deck : "def",
		weight : 8
	};
	counter++;
	connectDB(function(db) {
		var request = db.transaction(storeNameStorageDeck, "readonly")
				.objectStore(storeNameStorageDeck).get(counter);
		request.onerror = logerr;
		request.onsuccess = function() {
			fileForCard.id = request.result.id;
			fileForCard.question = request.result.question;
			fileForCard.answer = request.result.answer;
			fileForCard.repeat = request.result.repeat;
			fileForCard.deck = request.result.deck;
			// console.log(request.result.name);
			// addopt(request.result.name);
			if (counter <= countDeck) {
				EditTable(fileForCard);
				refreshOnEditDeck1();
			}
		}
	})

}
function createStudyDeck() {
	repeatCardCount=0;
	currentDeck.length = 0;
	counter = 0;
	counter2 = 0;
	connectDB(function(db) {
		var request = db.transaction(storeNameStorageDeck, "readonly")
				.objectStore(storeNameStorageDeck).get(0);
		request.onerror = logerr;
		request.onsuccess = function() {
			(function() {
				countDeck = request.result.count;
				console.log(countDeck);
				createStudyDeck1();
				studyUpdate();
			})();
		}
	});
}
function createStudyDeck1() {
	var fileForStudyDeck = {
		id : 0,
		question : "",
		answer : "",
		repeat : dateRepeat,
		count : 0,
		deck : "def",
		weight : 8

	};
	counter++;
	if (counter <= countDeck) {
		connectDB(function(db) {
			var request = db.transaction(storeNameStorageDeck, "readonly")
					.objectStore(storeNameStorageDeck).get(counter);
			request.onerror = logerr;
			request.onsuccess = function() {
				fileForStudyDeck.id = request.result.id;
				fileForStudyDeck.question = request.result.question;
				fileForStudyDeck.answer = request.result.answer;
				fileForStudyDeck.repeat = request.result.repeat;
				fileForStudyDeck.deck = request.result.deck;
				fileForStudyDeck.weight = request.result.weight;

				console.log("counter <= countDeck");
				editForStudyDeckNew(fileForStudyDeck);
				editForStudyDeckRepeat(fileForStudyDeck);
				// editForStudyDeckNew(fileForStudyDeck);
				createStudyDeck1();

			}
		})
	}

}
function editForStudyDeckRepeat(fileForStudyDeck) {
	console.log('editForStudyDeckRepeat1');
	if (currentDeckName == fileForStudyDeck.deck) {
		if (CurrentDT - fileForStudyDeck.repeat > 0) {
			repeatCardCount=repeatCardCount+1;
			console.log(CurrentDT);
			console.log('editForStudyDeckRepeat2');
			console.log(CurrentDT - fileForStudyDeck.repeat);
			currentDeck.push(fileForStudyDeck);
			console.log(currentDeck.length);
			console.log(currentDeck[currentDeck.length - 1]);
			currentDeck[currentDeck.length - 1].repeat = CurrentDT;
		}
	}
}
function editForStudyDeckNew(fileForStudyDeck) {
	if (currentDeckName == fileForStudyDeck.deck) {
		console.log('editForStudyDeckNew1');
		console.log(fileForStudyDeck.repeat);
		console.log(dateRepeat);
		if (fileForStudyDeck.repeat - dateRepeat == 0) {
			console.log('editForStudyDeckNew2');
			if (counter2 < countNewCard) {
				console.log('editForStudyDeckNew3');
				currentDeck.push(fileForStudyDeck);
				console.log(currentDeck.length);
				console.log(currentDeck[currentDeck.length - 1]);
				currentDeck[currentDeck.length - 1].repeat = CurrentDT;
				counter2 = counter2 + 1;
			}
		}
	}
}
function showCurrentDeck() {
	console.log("currentDeck");
	for (var i = 0; i < currentDeck.length; i++) {
		console.log(currentDeck[i]);
	}
}
//
/*function sortCurrentDeck() {
	currentDeck.sort(function(a, b) {
		if (a.repeat > b.repeat) {
			return 1;
		}
		if (a.repeat < b.repeat) {
			return -1;
		}
		// a должно быть равным b
		return 0;
	});
	showCurrentDeck();
}*/
function studyUpdate() {

	// sortCurrentDeck();
	currentDeck.sort(function(a, b) {
		if (a.repeat > b.repeat) {
			return 1;
		}
		if (a.repeat < b.repeat) {
			return -1;
		}
		// a должно быть равным b
		return 0;
	});
	showCurrentDeck();
	$("#answerOfLearnPage").text(currentDeck[0].answer);
	$("#questionOfLearnPage").text(currentDeck[0].question);
	/*
	 * document.getElementById("questionOfLearnPage").text =
	 * currentDeck[0].question; if (currentDeck[0].weight > 1) {
	 * document.getElementById("buttonMem1").val("напомнить через "+
	 * currentDeck[0].weight * 2 + "дней");
	 * document.getElementById("buttonMem2").value = "напомнить через " +
	 * currentDeck[0].weight / 2 + "дней";
	 * document.getElementById("buttonMem3").value = "напомнить через 1 день"; }
	 * else { document.getElementById("buttonMem1").value = "напомнить через 1
	 * день"; document.getElementById("buttonMem2").value = "напомнить через 10
	 * минут"; document.getElementById("buttonMem3").value = "напомнить через 10
	 * минут"; }
	 * 
	 */}
function studyUpdateB1() {
	if (currentDeck[0].weight >= 1) {
		currentDeck[0].weight = currentDeck[0].weight * 2;
		var W = currentDeck[0].weight;
		var D = new Date(CurrentDT.getTime());
		D.setDate(D.getDate() + W);
		currentDeck[0].repeat=D;
	} else {
		var D = new Date(CurrentDT.getTime());
		currentDeck[0].weight = 1;
		currentDeck[0].repeat.setDate(D.getDate()+ 1);

	}
	connectDB(function(db) {
		var request = db.transaction(storeNameStorageDeck, "readwrite")
				.objectStore(storeNameStorageDeck).put(currentDeck[0]);
		request.onerror = logerr;// добавили
		request.onsuccess = function() {
			//request.result;
			console.log("connectB1");
			currentDeck.shift();
			if (currentDeck.length == 0) {
				alert("урок закончен");
				window.location.href = '#start-menu';
			} else {
				 studyUpdate();
			}
		}
	});

}
function studyUpdateB2() {
	if (currentDeck[0].weight > 1) {
		currentDeck[0].weight = currentDeck[0].weight / 2;
		var W = currentDeck[0].weight;
		var D = new Date(CurrentDT.getTime());
		D.setDate(D.getDate() + W);
		currentDeck[0].repeat=D;
		
		connectDB(function(db) {
			var request = db.transaction(storeNameStorageDeck, "readwrite")
					.objectStore(storeNameStorageDeck).put(currentDeck[0]);
			request.onerror = logerr;// добавили
			request.onsuccess = function() {
				request.result;
				console.log("connectB2");
				currentDeck.shift();
				if (currentDeck.length == 0) {
					alert("урок закончен");
					window.location.href = '#start-menu';
				} else {
					studyUpdate();
				}
			}
		});

	}
	if (currentDeck[0].weight <= 1) {
		currentDeck[0].weight = 0.1;
		var W = 10;
		var D = new Date();
		D.setMinutes(D.getMinutes() + W);
		currentDeck[0].repeat=D;
/*		currentDeck[0].repeat
				.setMinutes(currentDeck[0].repeat.getMinutes() + 10);*/
		studyUpdate();
	}

}
function studyUpdateB3() {
	currentDeck[0].weight = 0.1;
	var W = 10;
	var D = new Date();
	D.setMinutes(D.getMinutes() + W);
	currentDeck[0].repeat=D;
	/*var t = currentDeck[0].repeat.getMinutes() + 10;
	currentDeck[0].repeat.setMinutes(t);*/
	studyUpdate();
}

/*
 * (function del(){ window.indexedDB.deleteDatabase("baseParam"); //
 * window.indexedDB.deleteDatabase("baseforStoreName");
 * window.indexedDB.deleteDatabase("filesBaselongmemoryV2");
 * window.indexedDB.deleteDatabase("filesBase");
 * window.indexedDB.deleteDatabase("filesBaselongmemory"); }());
 */


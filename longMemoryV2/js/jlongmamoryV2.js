var baseName = "filesBaselongmemoryV2";
var storeNameStorageDeck = "StorageDeck";
var storeNameCurrentDeck = "CurrentDeck";
var storeNameDeckName = "DeckName";
var countDeck = 0;
var dateRepeat = new Date(2000, 0, 1, 0, 0, 0, 0);
var counter = 0;// /????
var currentDeckName="def";
function logerr(err) {
	console.log(err);
}
function connectDB(f)// для хранения колод
{
	// console.log("hello");
	var d = new Date(2001, 0, 1, 0, 0, 0, 0);
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
			count : 0
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
(function(){
	connectDB();
})();
function add_deck() {
	var currentDeckName = document.getElementById("createpage-kol-name").value;
	var fileDeckParam = {
			id : 0,
			name : "defName",
			count : 0
		};
	(function() {
		connectDB(function(db)//забор количества
		{
			var request = db.transaction(storeNameDeckName, "readonly")
					.objectStore(storeNameDeckName).get(0);
			request.onerror = logerr;
			request.onsuccess = function() {

				countDeck = request.result.count;
				console.log(countDeck);
				(function()//добавление колоды 
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
						request.onerror = logerr;//добавили
						request.onsuccess = function() {
							(function()// изменение нулевого
							{
								fileDeckParam = {
										id : 0,
										name : "defName",
										count : countDeck + 1
									};
								connectDB(function(db) {
									var request = db.transaction(storeNameDeckName,
											"readwrite").objectStore(storeNameDeckName)
											.put(fileDeckParam);
									request.onerror = logerr;
									request.onsuccess = function() {
										console.log('true');
										//return request.result;
									};
								});
							})();
							//return request.result;
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
				refreshSelectDeck1()
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
function selectDeck()// 
{
	var select = document.getElementById("s1");
	for (var i = 0; i < select.options.length; i++) {
		var option = select.options[i];
		if (option.selected) {
			currentDeckName = option.value;
			alert(currentDeckName);
		}
	}
}
function add_card() {
	console.log('add0');
	var countCard = 0;
	var d = new Date(2001, 0, 1, 0, 0, 0, 0);
	var fileForCard = {
		id : 0,
		question : "",
		answer : "",
		repeat : d,
		count : 0,
		deck: "def"
	};
	connectDB(function(db)//забор количества карточек
			{
				var request = db.transaction(storeNameStorageDeck, "readonly")
						.objectStore(storeNameStorageDeck).get(0);
				request.onerror = logerr;
				request.onsuccess = function() {

					countCard = request.result.count;
					console.log(countCard);
					(function()//добавление карточки 
					{
						var ques=document.getElementById("questionOfAddCard").value;
						var answ=document.getElementById("answerOfAddCard").value;
						fileForCard = {
								id : 0,
								question : ques,
								answer : answ,
								repeat : dateRepeat,
								count : countCard,
								deck: currentDeckName
							};
						connectDB(function(db) {
							var request = db.transaction(storeNameStorageDeck,
									"readwrite").objectStore(storeNameStorageDeck)
									.put(fileForCard);
							request.onerror = logerr;//добавили
							request.onsuccess = function() {
								(function()// изменение нулевого
								{
									fileForCard = {
											id : 0,
											question : "how many",
											answer : "null",
											repeat : dateRepeat,
											deck : "def",
											count : countCard
										};
									connectDB(function(db) {
										var request = db.transaction(storeNameStorageDeck,
												"readwrite").objectStore(storeNameStorageDeck)
												.put(fileForCard);
										request.onerror = logerr;
										request.onsuccess = function() {
											console.log('true');
											//return request.result;
										};
									});
								})();
								//return request.result;
							};
						});
					})();

				}
			});
	
	
	
	

}
/*
 * (function del(){ window.indexedDB.deleteDatabase("baseParam"); //
 * window.indexedDB.deleteDatabase("baseforStoreName");
 * window.indexedDB.deleteDatabase("filesBaselongmemoryV2");
 * window.indexedDB.deleteDatabase("filesBase");
 * window.indexedDB.deleteDatabase("filesBase2");
 * 
 * 
 * }());
 */

/**
@return {Object} A new empty set object.
@api public
**/
function create () {
	return Object.create(null);
}


var hasItemIn = Object.prototype.hasOwnProperty;

/**
Determines whether a Set object contains the specified element.
@param {Object} set The set.
@param {String} item The element to locate in the HashSet<T> object.
@return {Boolean} true if the HashSet<T> object contains the specified element; otherwise, false.
@api public
**/
function has (set, item) {
	return hasItemIn.call(set, item);
}

/**
@param {Object} set The set.
@return {Array} 
@api public
**/
function toArray (set) {
	return Array.isArray(set) ? set : set && Object.keys(set);
}

function _countFn (set, array, fn) {
	for (var i = 0, c = 0; i < array.length; i++)
		if (fn(set, array[i])) c++;
	return c;
}

/**
Adds the specified element to a set.
@param {Object} set The set.
@param {String} item The element to add to the set.
@return {Boolean} true if the element is added to the Set object; false if the element is already present.
@api public
**/
function add (set, item) {
	return !has(set, item) && !(set[item] = null);
}

function addSet (setA, setB) {
	return _countFn(setA, toArray(setB), add);
}

/**
Removes an element from the set.
@param {Object} set The set.
@param {String} item 
@return {Boolean} 
@api public
**/
function remove (set, item) {
	return has(set, item) && delete set[item];
}

/**
Removes all elements in setB from setA.
@param {Object} setA
@param {Object|Array} setB
**/
function removeSet (setA, setB) {
	return _countFn(setA, toArray(setB), remove);
}

/**
Modifies setA to contain only elements that are present in setA and in setB.
@param {Object} setA
@param {Object|Array} setB
@api public
**/
function intersectWith (setA, setB) {
	var arr = toArray(setA);
	for (var i = 0; i < arr.length; i++)
		if (!has(setB, arr[i]))
			delete setA[arr[i]];

	// toArray(setA).forEach(function (item) {
	// 	if (!has(setB, item)) remove(setA, item);
	// });
}

/**
Modifies the set to contain only elements that are present either in setA or in setB, but not both.
@param {Object} setA
@param {Object|Array} setB
**/
function symmetricRemoveSet (setA, setB) {
	setB = toArray(setB);
	for (var i = 0; i < setB.length; i++)
		if (!add(setA, setB[i]))
			delete setA[setB[i]];
}

function from (set) {
	var o = create();
	addSet(o, set);
	return o;
}

/**
Removes the set from the set, leaving an empty set.
@param {Object} set The set.
@api public
**/
function clear (set) {
	removeSet(set, set);
}

/**
The number of elements that are contained in the set.
@param {Object} set The set.
@api public
**/
function size (set) {
	return toArray(set).length;
}

/**
@param {Object|Array} set A set or an array.
@return {Object} A new set object
@api public
**/
function clone (set) {
	var o = create();
	addSet(o, set);
	return o;
}


// === mutable set operations =========================


/**
Determines whether the two sets share common elements.
@param {Object} setA
@param {Object|Array} setB
@return {Boolean} true if the two sets share at least one common element; otherwise, false.
@api public
**/
function overlaps (setA, setB) {
	return toArray(setB).some(hasItemIn, setA);
}

/**
Determines whether the two sets contain the same elements.
@param {Object} setA
@param {Object|Array} setB
@return {Boolean} true if the two sets contain the same elements; otherwise, false.
@api public
**/
function equals (setA, setB) {
	setB = toArray(setB);
	return setB.length === size(setA) && setB.every(hasItemIn, setA);
}

/**
Determines whether A is a subset of B.

An empty set is a subset of any other collection, including an empty set;
therefore, this method returns true if A is empty, even if B is an empty set.

This method always returns false if the number of elements in A is greater
than the number of elements in B.

@param {Object|Array} setA
@param {Object} setB
@api public
**/
function isSubsetOf (setA, setB) {
	setA = toArray(setA);
	return setA.length <= size(setB) && setA.every(hasItemIn, setB);
}

/**
Determines whether A is a proper subset of B.

An empty set is a proper subset of any other collection. Therefore, this
method returns true if A is empty unless the other parameter is also an empty
set.

This method always returns false if the number of elements in A is greater
than or equal to the number of elements in B.

@param {Object|Array} setA
@param {Object} setB
@api public
**/
function isProperSubsetOf (setA, setB) {
	setA = toArray(setA);
	return setA.length < size(setB) && setA.every(hasItemIn, setB);
}

/**
Determines whether A is a superset of B.

All collections, including the empty set, are supersets of the empty set.
Therefore, this method returns true if B is empty, even if A is empty.

This method always returns false if the number of elements in A is less than
the number of elements in B.

@param {Object} setA
@param {Object|Array} setB
@api public
**/
function isSupersetOf (setA, setB) {
	setB = toArray(setB);
	return size(setA) >= setB.length && setB.every(hasItemIn, setA);
}

/**
Determines whether A is a proper superset of B.

An empty set is a proper superset of any other collection. Therefore, this
method returns true if B is empty unless A is also empty.

This method always returns false if the number of elements in A is less than
or equal to the number of elements in B.

@param {Object} setA
@param {Object|Array} setB
@api public
**/
function isProperSupersetOf (setA, setB) {
	setB = toArray(setB);
	return size(setA) > setB.length && setB.every(hasItemIn, setA);
}


// === immutable set operations =========================


/**
Union of the sets A and B is the set of all objects that are a member of A, or
B, or both. The union of {1, 2, 3} and {2, 3, 4} is the set {1, 2, 3, 4}.
**/
function union (setA, setB) {
	addSet(setA = clone(setA), setB);
	return setA;
}

/**

Set difference of A and B is the set of all members of A that are not members of B.

The set difference {1,2,3} \ {2,3,4} is {1}, while, conversely, the set difference {2,3,4} \ {1,2,3} is {4}.

**/
function setDifference (setA, setB) {
	// var set = create();
	// setA = toArray(setA);
	// for (var i = 0; i < setA.length; i++)
	// 	if (!has(setB, setA[i]))
	// 		add(set, setA[i]);
	// return set;

	removeSet(setA = clone(setA), setB);
	return setA;
}

function unionMany (setArray) {
	var set = create();
	_countFn(set, setArray, addSet);
	return set;

	// var i = 0, set = create();
	// for (; i < setArray.length; i++) {
	// 	addSet(set, setArray[i]);
	// }
	// return set;
}


/**
Intersection of the sets A and B is the set of all objects that are members of
both A and B. The intersection of {1, 2, 3} and {2, 3, 4} is the set {2, 3}.
**/
function intersection (setA, setB) {
	var set = clone(setA);
	symmetricRemoveSet(set, setB);
	return set;
}

function intersectionMany (setArray) {
	var set = create();
	_countFn(set, setArray, symmetricRemoveSet);
	return set;

	// var i = 0, set;
	// for (; i < setArray.length; i++) {
	// 	if (set) {
	// 		symmetricRemoveSet(set, setArray[i]);
	// 	} else {
	// 		set = clone(setArray[i]);
	// 	}
	// }
	// return set;
}


// === oop =========================


function Set (set) {
	this._set = create();

	if (set) {
		if (set instanceof Set) {
			set = set._set;
		}
		this.addSet(set);
	}
}

Set.create = create;
Set.from = from;
Set.union = union;

// Set.prototype.clear = function () {
// 	this._set = create();
// };

Set.prototype.toString = function () {
	return this.toArray().toString();
};

[ has
, add
, addSet
, remove
, removeSet
, symmetricRemoveSet
, toArray
, clear
, size
, clone
, intersectWith
, overlaps
, equals
, isSubsetOf
, isProperSubsetOf
, isSupersetOf
, isProperSupersetOf
].forEach(function (method) {
	Set[method.name] = method;
	Set.prototype[method.name] = function (arg) {
		return method(this._set, arg);
	};
});


module.exports = Set;




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
	return Object.keys(set);
}

/**
@param {Object} set The set.
@param {Function} fn 
@param {Object} ctx 
@return {Boolean} 
@api public
**/
function each (set, fn, ctx) {
	toArray(set).forEach(fn, ctx);
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

function addArray (set, array) {
	return _countFn(set, array, add);
}

// aka unionWith
function addSet (set, other) {
	return addArray(set, toArray(other));
}
// void UnionWith (IEnumerable<T> other);
// function unionWith (set, other) {
// 	addSet(set, other);
// }


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

function _removeIfNotAdded (set, item) {
	if (!add(set, item)) delete set[item];
}

/**
Removes all elements in the array from the set.
**/
function removeArray (set, array) {
	return _countFn(set, array, remove);
}

/**
Removes all elements in the second set from the first set.
**/
function removeSet (set, other) {
	return removeArray(set, toArray(other));
}

/**
Modifies the set to contain only elements that are present either in that object or in the array, but not both.
**/
function symmetricRemoveArray (set, array) {
	_countFn(set, array, _removeIfNotAdded);
}

/**
Modifies the set to contain only elements that are present either in that object or in the other set, but not both.
**/
function symmetricRemoveSet (set, other) {
	symmetricRemoveArray(set, toArray(other));
}

/**
@param {Object} set The set.
@param {Function} fn 
@return {Boolean} 
@api public
**/
function removeWhere (set, fn) {
	var count = 0;
	each(set, function (item) {
		if (fn(item) && remove(set, item)) count++;
	});
	return count;
}

function fromArray (array) {
	var set = create();
	addArray(set, array);
	return set;
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
@param {Object} set The set.
@return {Boolean} 
@api public
**/
function clone (set) {
	var o = create();
	addSet(o, set);
	return o;
}


// === mutable set operations =========================


/**
Modifies the set object to contain only elements that are present in that object and in the other set.
**/
function intersectWith (set, other) {
	removeWhere(set, function (item) {
		return !has(other, item);
	});
}

/**
Determines whether the two sets share common elements.
@return {Boolean} true if the two sets share at least one common element; otherwise, false.
@api public
**/
function overlaps (set, other) {
	return toArray(other).some(hasItemIn, set);
}

/**
Determines whether the two sets contain the same elements.
@api public
**/
function equals (set, other) {
	set = toArray(set);
	return set.length === size(other) && set.every(hasItemIn, other);
}

// bool IsSubsetOf (IEnumerable<T> other);
function isSubsetOf (set, other) {
	set = toArray(set);
	return !set.length || (set.length <= size(other) && set.every(hasItemIn, other));
}

// bool IsProperSubsetOf (IEnumerable<T> other);
function isProperSubsetOf (set, other) {
	set = toArray(set);
	return !set.length || (set.length < size(other) && set.every(hasItemIn, other));
}

// bool IsSupersetOf (IEnumerable<T> other);
function isSupersetOf (set, other) {
	other = toArray(other);
	return size(set) >= other.length && other.every(hasItemIn, set);
}

// bool IsProperSupersetOf (IEnumerable<T> other);
function isProperSupersetOf (set, other) {
	other = toArray(other);
	return size(set) > other.length && other.every(hasItemIn, set);
}


// === immutable set operations =========================


/**
Union of the sets A and B is the set of all objects that are a member of A, or B, or both. The union of {1, 2, 3} and {2, 3, 4} is the set {1, 2, 3, 4}.
**/
function union (setA, setB) {
	addSet(setA = clone(setA), setB);
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
Intersection of the sets A and B is the set of all objects that are members of both A and B. The intersection of {1, 2, 3} and {2, 3, 4} is the set {2, 3}.
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

/**
Set difference of U and A, denoted U \ A, is the set of all members of U that
are not members of A. The set difference {1,2,3} \ {2,3,4} is {1} , while,
conversely, the set difference {2,3,4} \ {1,2,3} is {4} . When A is a subset of
U, the set difference U \ A is also called the complement of A in U. In this
case, if the choice of U is clear from the context, the notation Ac is sometimes
used instead of U \ A, particularly if U is a universal set as in the study of
Venn diagrams.
**/
function setDifference () {
	
}

/**
Cartesian product of A and B, denoted A × B, is the set whose members are all possible ordered pairs (a,b) where a is a member of A and b is a member of B.
The cartesian product of {1, 2} and {red, white} is {(1, red), (1, white), (2, red), (2, white)}.
**/
function cartesianProduct (setA, setB) {
	
}



// === oop =========================

function Set () {
	this._set = create();
}

Set.create = create;
Set.fromArray = fromArray;

// Set.prototype.clear = function () {
// 	this._set = create();
// };

Set.prototype.toString = function () {
	return this.toArray().toString();
};

[ has
, add
, addArray
, addSet
, remove
, removeArray
, removeSet
, symmetricRemoveArray
, symmetricRemoveSet
, toArray
, each
, removeWhere
, clear
, size
, clone
, intersectWith
// , exceptWith
, overlaps
, equals
// , symmetricExceptWith
// , unionWith
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



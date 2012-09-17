
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
Adds the specified element to a set.
@param {Object} set The set.
@param {String} item The element to add to the set.
@return {Boolean} true if the element is added to the Set object; false if the element is already present.
@api public
**/
function add (set, item) {
	// return !has(set, item) && !(set[item] = null);
	if (has(set, item)) {
		return false;
	}
	set[item] = null;
	return true;
}

function addMany (set, array) {
	for (var i = 0, c = 0; i < array.length; i++) {
		c += add(set, array[i]) ? 1 : 0;
	}
	return c;
}

/**

@param {Object} set The set.
@param {String} item 
@return {Boolean} 
@api public
**/
function remove (set, item) {
	if (has(set, item)) {
		delete set[item];
		return true;
	}
	return false;
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
@return {Boolean} 
@api public
**/
function each (set, fn) {
	toArray(set).forEach(fn);
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
		if (fn(item)) {
			delete set[item];
			count++;
		}
	});
	return count;
}

/**
Removes all elements from a HashSet<T> object.
@param {Object} set The set.
@api public
**/
function clear (set) {
	each(set, function (item) {
		delete set[item];
	});
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
	unionWith(o, set);
	return o;
}

function fromArray (array) {
	var set = create();
	addMany(set, array);
	return set;
}


// === mutable set operations =========================


// void IntersectWith (IEnumerable<T> other);
function intersectWith (set, other) {
	removeWhere(set, function (item) {
		return !has(other, item);
	});
}

// void ExceptWith (IEnumerable<T> other);
function exceptWith (set, other) {
	each(other, function (item) {
		delete set[item];
	});
}

// bool Overlaps (IEnumerable<T> other);
function overlaps (set, other) {
	return toArray(other).some(hasItemIn, set);
}

// bool SetEquals (IEnumerable<T> other);
function equals (set, other) {
	set = toArray(set);
	return set.length !== size(other) && set.every(hasItemIn, other);
}

// void SymmetricExceptWith (IEnumerable<T> other);
function symmetricExceptWith (set, other) {
	each(other, function (item) {
		if (!add(set, item)) {
			remove(set, item);
		}
	});
}

// void UnionWith (IEnumerable<T> other);
function unionWith (set, other) {
	addMany(set, toArray(other));
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
	var set = clone(setA);
	unionWith(set, setB);
	return set;
}

function unionMany (setArray) {
	var i = 0, set;
	for (; i < setArray.length; i++) {
		unionWith(set || (set = create()), setArray[i]);
	}
	return set;
}


/**
Intersection of the sets A and B is the set of all objects that are members of both A and B. The intersection of {1, 2, 3} and {2, 3, 4} is the set {2, 3}.
**/
function intersection (setA, setB) {
	var set = clone(setA);
	symmetricExceptWith(set, setB);
	return set;
}

function intersectionMany (setArray) {
	var i = 0, set;
	for (; i < setArray.length; i++) {
		if (set) {
			symmetricExceptWith(set, setArray[i]);
		} else {
			set = clone(setArray[i]);
		}
	}
	return set;
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

// Set.prototype.clear = function () {
// 	this._set = create();
// };

[ has
, add
, remove
, toArray
, each
, removeWhere
, clear
, size
, clone
, intersectWith
, exceptWith
, overlaps
, equals
, symmetricExceptWith
, unionWith
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



var Set = require('../');
var assert = require('assert');

describe('Set.create()', function(){
	it('should return an empty object', function(){
		var o = Set.create();
		assert.strictEqual('object', typeof o);
		var i = 0;
		for (var k in o) i++;
		assert.strictEqual(0, i);
		assert.strictEqual(undefined, o.hasOwnProperty);
	});
});

describe('Set.has(set, item)', function(){
	it('should return true if the object contains the item', function(){
		var o = Set.create();
		assert.strictEqual(false, Set.has(o, 'foo'));
		Set.add(o, 'foo');
		assert.strictEqual(true, Set.has(o, 'foo'));
		o.foo = null;
		assert.strictEqual(true, Set.has(o, 'foo'));
		delete o.foo;
		assert.strictEqual(false, Set.has(o, 'foo'));
	});
});

describe('Set.toArray(set)', function(){
	it('should return an array containing all the items in the set', function(){
		var o = Set.create();
		Set.addSet(o, ['a', 'b', 'c']);
		var arr = Set.toArray(o);
		assert.strictEqual(true, Array.isArray(arr));
		assert.strictEqual(3, arr.length);
		assert.strictEqual('abc', arr.sort().join(''));
	});
});

describe('Set.add(set, item)', function(){
	it('should add the item and return true if it was added', function(){
		var o = Set.create();
		assert.strictEqual(false, Set.has(o, 'a'));
		var added = Set.add(o, 'a');
		assert.strictEqual(true, Set.has(o, 'a'));
		assert.strictEqual(true, added);
		added = Set.add(o, 'a');
		assert.strictEqual(false, added);
	});
});

describe('Set.addSet(A, B)', function(){
	it('should add all unique items in B to A and return the number of added items', function(){
		var a = Set.create();

		//TODO: Add manually
		var b = Set.from(['a', 'b', 'c', 'b', 'a']);

		var count = Set.addSet(a, b);
		assert.strictEqual(3, count);
		var s = Set.toArray(a).sort().join(',');
		assert.strictEqual('a,b,c', s);
	});
});

describe('Set.remove(set, item)', function(){
	it('should remove the item and return true if it was removed', function(){
		var o = Set.create();
		Set.addSet(o, ['a', 'b', 'c']);
		assert.strictEqual(true, Set.has(o, 'a'));
		Set.remove(o, 'a');
		assert.strictEqual(false, Set.has(o, 'a'));
	});
});

describe('Set.removeSet(A, B)', function(){
	it('should modify the set to contain only items that are present in that object and in the other set', function(){
		var a = Set.from(['a', 'b', 'c', 'd', 'e', 'f', 'x']);
		var b = Set.from(['d', 'e', 'f', 'y', 'z']);
		var count = Set.removeSet(a, b);
		assert.strictEqual(3, count, 'removed 3 items');
		assert.strictEqual(4, Set.size(a), 'size is now 4');
		var s = Set.toArray(a).sort().join(',');
		assert.strictEqual('a,b,c,x', s);
	});
});

describe('Set.symmetricRemoveSet(A, B)', function(){
	it('should modify the set to contain only elements that are present either in A or in B, but not both', function(){
		var o = Set.from(['a', 'b', 'c', 'd', 'e', 'f', 'x']);
		var o2 = Set.from(['d', 'e', 'f', 'y', 'z']);
		Set.symmetricRemoveSet(o, o2);
		assert.strictEqual(6, Set.size(o), 'size is now 4');
		var s = Set.toArray(o).sort().join(',');
		assert.strictEqual('a,b,c,x,y,z', s);
	});
});

describe('Set.from([...])', function(){
	it('should  create a new object and add all unique items in an array', function(){
		var o = Set.from(['a', 'b', 'c', 'b', 'a']);
		var arr = Set.toArray(o);
		assert.strictEqual(3, arr.length);
		assert.strictEqual('a,b,c', arr.sort().join(','));
	});
});

describe('Set.clear(set)', function(){
	it('should clear the set', function(){
		var o = Set.from(['a', 'b', 'c', 'd', 'e', 'f']);
		Set.clear(o);
		var arr = Set.toArray(o);
		assert.strictEqual(0, arr.length);
	});
});

describe('Set.size(set)', function(){
	it('should return the number of items in the set', function(){
		var o = Set.create();
		assert.strictEqual(0, Set.size(o));
		Set.addSet(o, ['a', 'b', 'c', 'd', 'e', 'f']);
		assert.strictEqual(6, Set.size(o));
		Set.clear(o);
		var arr = Set.toArray(o);
		assert.strictEqual(0, arr.length);
	});
});

describe('Set.clone(set)', function(){
	it('should return a clone of the set', function(){
		var orig = Set.from(['a', 'b', 'c']);
		var clone = Set.clone(orig);
		assert.notStrictEqual(orig, clone, 'not the same ref');
		assert.strictEqual(Set.size(orig), Set.size(clone), 'same size');
		var s1 = Set.toArray(orig).sort().join(',');
		var s2 = Set.toArray(clone).sort().join(',');
		assert.strictEqual(s1, s2, 'same items');
	});
});

describe('Set.intersectWith(A, B)', function(){
	it('should modify A to contain only items that are present in A and in B', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['b', 'c', 'd']);
		Set.intersectWith(a, b);
		assert.strictEqual(2, Set.size(a));
		var s = Set.toArray(a).sort().join(',');
		assert.strictEqual('b,c', s);
	});
});

describe('Set.overlaps(A, B)', function(){
	it('should return true if the two sets share common elements', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['x', 'a', 'y']);
		assert.strictEqual(true, Set.overlaps(a, b));
	});
	it('should return false if the two sets share no common elements', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['d', 'e', 'f']);
		assert.strictEqual(false, Set.overlaps(a, b));
	});
});

describe('Set.equals(A, B)', function(){
	it('should return true if the two sets have the same number of elements and contain the same elements', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['c', 'a', 'b']);
		assert.strictEqual(true, Set.equals(a, b));
	});
	it('should return true if both A and B are empty', function(){
		var a = Set.create();
		var b = Set.create();
		assert.strictEqual(true, Set.equals(a, b));
	});
	it('should return false if the one or more elements differ', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['a', 'b', 'x']);
		assert.strictEqual(false, Set.equals(a, b));
	});
	it('should return false if A has elements not found in B', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['a', 'b', 'c', 'x']);
		assert.strictEqual(false, Set.equals(a, b));
	});
	it('should return false if B has elements not found in A', function(){
		var a = Set.from(['a', 'b', 'c', 'x']);
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(false, Set.equals(a, b));
	});
});

describe('Set.isSubsetOf(A, B)', function(){
	it('should return true if A is empty', function(){
		var a = Set.create();
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(true, Set.isSubsetOf(a, b));
	});
	it('should return true if A is empty, even if B is empty', function(){
		var a = Set.create();
		var b = Set.create();
		assert.strictEqual(true, Set.isSubsetOf(a, b));
	});
	it('should return true if the sets are equal', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(true, Set.isSubsetOf(a, b));
	});
	it('should return false if A is larger', function(){
		var a = Set.from(['a', 'b', 'c', 'd']);
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(false, Set.isSubsetOf(a, b));
	});
	it('should return false if A contains an elements not found in B', function(){
		var a = Set.from(['x']);
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(false, Set.isSubsetOf(a, b));
	});
});

describe('Set.isProperSubsetOf(A, B)', function(){
	it('should return true if A is empty', function(){
		var a = Set.create();
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(true, Set.isProperSubsetOf(a, b));
	});
	it('should return true if A contains some of the elements in B but not all', function(){
		var a = Set.from(['a', 'b']);
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(true, Set.isProperSubsetOf(a, b));
	});
	it('should return false if both A and B are empty', function(){
		var a = Set.create();
		var b = Set.create();
		assert.strictEqual(false, Set.isProperSubsetOf(a, b));
	});
	it('should return false if the sets are equal', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(false, Set.isProperSubsetOf(a, b));
	});
	it('should return false if A is larger', function(){
		var a = Set.from(['a', 'b', 'c', 'd']);
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(false, Set.isProperSubsetOf(a, b));
	});
	it('should return false if A contains an elements not found in B', function(){
		var a = Set.from(['x']);
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(false, Set.isProperSubsetOf(a, b));
	});
});

describe('Set.isSupersetOf(A, B)', function(){
	it('should return true if B is empty', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.create();
		assert.strictEqual(true, Set.isSupersetOf(a, b));
	});
	it('should return true if B is empty, even if A is empty', function(){
		var a = Set.create();
		var b = Set.create();
		assert.strictEqual(true, Set.isSupersetOf(a, b));
	});
	it('should return true if the sets are equal', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(true, Set.isSupersetOf(a, b));
	});
	it('should return false if B is larger', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['a', 'b', 'c', 'd']);
		assert.strictEqual(false, Set.isSupersetOf(a, b));
	});
	it('should return false if B contains an elements not found in A', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['a', 'x']);
		assert.strictEqual(false, Set.isSupersetOf(a, b));
	});
});

describe('Set.isProperSupersetOf(A, B)', function(){
	it('should return true if B is empty', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.create();
		assert.strictEqual(true, Set.isProperSupersetOf(a, b));
	});
	it('should return true if A is a proper superset of B', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['a', 'b']);
		assert.strictEqual(true, Set.isProperSupersetOf(a, b));
	});
	it('should return false if both A and B are empty', function(){
		var a = Set.create();
		var b = Set.create();
		assert.strictEqual(false, Set.isProperSupersetOf(a, b));
	});
	it('should return false if the sets are equal', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(false, Set.isProperSupersetOf(a, b));
	});
	it('should return false if B is larger', function(){
		var a = Set.from(['a', 'b']);
		var b = Set.from(['a', 'b', 'c']);
		assert.strictEqual(false, Set.isProperSupersetOf(a, b));
	});
	it('should return false if B contains an elements not found in A', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['a', 'x']);
		assert.strictEqual(false, Set.isProperSupersetOf(a, b));
	});
});

describe('Set.union(A, B)', function(){
	it('should return the set of all elements that are a member of A, or B, or both', function(){
		var a = Set.from(['a', 'b', 'c']);
		var b = Set.from(['b', 'c', 'd']);
		var c = Set.union(a, b);
		var arr = Set.toArray(c);
		assert.strictEqual(4, arr.length);
		assert.strictEqual('a,b,c,d', arr.sort().join(','));
	});
});





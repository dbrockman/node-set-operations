var Set = require('../');
var assert = require('assert');

describe('static functions', function(){
	
	describe('create()', function(){
		it('should return an empty object', function(){
			var o = Set.create();
			assert.strictEqual('object', typeof o);
			var i = 0;
			for (var k in o) i++;
			assert.strictEqual(0, i);
			assert.strictEqual(undefined, o.hasOwnProperty);
		});
	});

	describe('has()', function(){
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

	describe('toArray()', function(){
		it('should return an array containing all the items in the set', function(){
			var o = Set.create();
			Set.addArray(o, ['a', 'b', 'c']);
			var arr = Set.toArray(o);
			assert.strictEqual(true, Array.isArray(arr));
			assert.strictEqual(3, arr.length);
			assert.strictEqual('abc', arr.sort().join(''));
		});
	});

	describe('each()', function(){
		it('should loop the set', function(){
			var o = Set.create();
			Set.addArray(o, ['a', 'b', 'c']);
			var arr = [];
			Set.each(o, function (item) {
				arr.push(item);
			});
			assert.strictEqual(3, arr.length);
			assert.strictEqual('abc', arr.sort().join(''));
		});
	});

	describe('add()', function(){
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

	describe('addArray()', function(){
		it('should add all unique items in an array and return the number of added items', function(){
			var o = Set.create();
			var count = Set.addArray(o, ['a', 'b', 'c', 'b', 'a']);
			assert.strictEqual(3, count);
			var s = Set.toArray(o).sort().join(',');
			assert.strictEqual('a,b,c', s);
		});
	});

	describe('remove()', function(){
		it('should remove the item and return true if it was removed', function(){
			var o = Set.create();
			Set.addArray(o, ['a', 'b', 'c']);
			assert.strictEqual(true, Set.has(o, 'a'));
			Set.remove(o, 'a');
			assert.strictEqual(false, Set.has(o, 'a'));
		});
	});

	describe('removeArray()', function(){
		it('should remove all items in an array and return the number of removed items', function(){
			var o = Set.create();
			Set.addArray(o, ['a', 'b', 'c', 'd', 'e', 'f', 'x']);
			var count = Set.removeArray(o, ['d', 'e', 'f', 'y', 'z']);
			assert.strictEqual(3, count, 'removed 3 items');
			assert.strictEqual(4, Set.size(o), 'size is now 4');
			var s = Set.toArray(o).sort().join(',');
			assert.strictEqual('a,b,c,x', s);
		});
	});

	describe('removeSet()', function(){
		it('should modify the set to contain only items that are present in that object and in the other set', function(){
			var a = Set.fromArray(['a', 'b', 'c', 'd', 'e', 'f', 'x']);
			var b = Set.fromArray(['d', 'e', 'f', 'y', 'z']);
			var count = Set.removeSet(a, b);
			assert.strictEqual(3, count, 'removed 3 items');
			assert.strictEqual(4, Set.size(a), 'size is now 4');
			var s = Set.toArray(a).sort().join(',');
			assert.strictEqual('a,b,c,x', s);
		});
	});

	describe('symmetricRemoveArray()', function(){
		it('should modify the set to contain only elements that are present either in that object or in the array, but not both', function(){
			var o = Set.fromArray(['a', 'b', 'c', 'd', 'e', 'f', 'x']);
			Set.symmetricRemoveArray(o, ['d', 'e', 'f', 'y', 'z']);
			assert.strictEqual(6, Set.size(o), 'size is now 4');
			var s = Set.toArray(o).sort().join(',');
			assert.strictEqual('a,b,c,x,y,z', s);
		});
	});

	describe('symmetricRemoveSet()', function(){
		it('should modify the set to contain only elements that are present either in that object or in the other set, but not both', function(){
			var o = Set.fromArray(['a', 'b', 'c', 'd', 'e', 'f', 'x']);
			var o2 = Set.fromArray(['d', 'e', 'f', 'y', 'z']);
			Set.symmetricRemoveSet(o, o2);
			assert.strictEqual(6, Set.size(o), 'size is now 4');
			var s = Set.toArray(o).sort().join(',');
			assert.strictEqual('a,b,c,x,y,z', s);
		});
	});

	describe('removeWhere()', function(){
		it('should remove items from the set with a bool function', function(){
			var o = Set.create();
			Set.addArray(o, ['a', 'b', 'c', 'd', 'e', 'f']);
			var count = Set.removeWhere(o, function (item) {
				return item > 'c';
			});
			assert.strictEqual(3, count);
			var s = Set.toArray(o).sort().join(',');
			assert.strictEqual('a,b,c', s);
		});
	});

	describe('fromArray()', function(){
		it('should  create a new object and add all unique items in an array', function(){
			var o = Set.fromArray(['a', 'b', 'c', 'b', 'a']);
			var arr = Set.toArray(o);
			assert.strictEqual(3, arr.length);
			assert.strictEqual('a,b,c', arr.sort().join(','));
		});
	});

	describe('clear()', function(){
		it('should clear the set', function(){
			var o = Set.fromArray(['a', 'b', 'c', 'd', 'e', 'f']);
			Set.clear(o);
			var arr = Set.toArray(o);
			assert.strictEqual(0, arr.length);
		});
	});

	describe('size()', function(){
		it('should return the number of items in the set', function(){
			var o = Set.create();
			assert.strictEqual(0, Set.size(o));
			Set.addArray(o, ['a', 'b', 'c', 'd', 'e', 'f']);
			assert.strictEqual(6, Set.size(o));
			Set.clear(o);
			var arr = Set.toArray(o);
			assert.strictEqual(0, arr.length);
		});
	});

	describe('clone()', function(){
		it('should return a clone of the set', function(){
			var orig = Set.fromArray(['a', 'b', 'c']);
			var clone = Set.clone(orig);
			assert.notStrictEqual(orig, clone, 'not the same ref');
			assert.strictEqual(Set.size(orig), Set.size(clone), 'same size');
			var s1 = Set.toArray(orig).sort().join(',');
			var s2 = Set.toArray(clone).sort().join(',');
			assert.strictEqual(s1, s2, 'same items');
		});
	});

	describe('intersectWith()', function(){
		it('should modify the set to contain only items that are present in that object and in the other set', function(){
			var a = Set.fromArray(['a', 'b', 'c']);
			var b = Set.fromArray(['b', 'c', 'd']);
			Set.intersectWith(a, b);
			assert.strictEqual(2, Set.size(a));
			var s = Set.toArray(a).sort().join(',');
			assert.strictEqual('b,c', s);
		});
	});

	describe('overlaps()', function(){
		it('should return true if the two sets share common elements', function(){
			var a = Set.fromArray(['a', 'b', 'c']);
			var b = Set.fromArray(['b', 'c', 'd']);
			assert.strictEqual(true, Set.overlaps(a, b));
		});
		it('should return false if the two sets share no common elements', function(){
			var a = Set.fromArray(['a', 'b', 'c']);
			var b = Set.fromArray(['d', 'e', 'f']);
			assert.strictEqual(false, Set.overlaps(a, b));
		});
	});

	describe('equals()', function(){
		it('should return true if the two sets contain the same elements', function(){
			var a = Set.fromArray(['a', 'b', 'c']);
			var b = Set.fromArray(['c', 'a', 'b']);
			assert.strictEqual(true, Set.equals(a, b));
		});
		it('should return false if the two sets does not contain the same elements', function(){
			var a = Set.fromArray(['a', 'b', 'c']);
			var b = Set.fromArray(['a', 'b', 'x']);
			assert.strictEqual(false, Set.equals(a, b));
		});
	});

});




